require('dotenv').config();

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('node:crypto');

const User = require('./models/User');
const Image = require('./models/image');
const SkinAnalysis = require('./models/SkinAnalysis');
const Report = require('./models/Report');
const Content = require('./models/Content');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function matchesImageType(imageBytes, contentType) {
  if (contentType === 'image/jpeg') {
    return imageBytes.length >= 3 &&
      imageBytes[0] === 0xff &&
      imageBytes[1] === 0xd8 &&
      imageBytes[2] === 0xff;
  }

  if (contentType === 'image/png') {
    return imageBytes.length >= 8 &&
      imageBytes.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      );
  }

  if (contentType === 'image/webp') {
    return imageBytes.length >= 12 &&
      imageBytes.toString('ascii', 0, 4) === 'RIFF' &&
      imageBytes.toString('ascii', 8, 12) === 'WEBP';
  }

  return false;
}

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use((req, res, next) => {
  res.locals.requestId = crypto.randomUUID();
  res.set('X-Request-Id', res.locals.requestId);
  next();
});
app.use(express.json({ limit: '14mb' }));

// Admin routes require a valid JWT with role: "admin".
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({
      error: 'Server authentication is not configured'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ===============================
// MongoDB connection
// ===============================
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not configured in backend/server/.env');
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error.message));
}

// ===============================
// Admin login
// ===============================
app.post('/api/admin/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: 'Email and password are required.',
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'Server authentication is not configured.',
    });
  }

  const admin = await Admin.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!admin) {
    return res.status(401).json({
      error: 'Invalid email or password.',
    });
  }

  let passwordMatches = false;

  try {
    passwordMatches = await bcrypt.compare(password, admin.password);
  } catch (error) {
    console.error('Admin password verification failed:', error.message);
  }

  if (!passwordMatches) {
    return res.status(401).json({
      error: 'Invalid email or password.',
    });
  }

  const token = jwt.sign(
    {
      id: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    message: 'Login successful',
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
    },
  });
}));

// ===============================
// User profile API
// ===============================
app.post('/api/users', asyncHandler(async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw new ApiError(400, 'INVALID_USER', error.message);
    }
    if (error.code === 11000) {
      throw new ApiError(409, 'USER_ALREADY_EXISTS',
        'A user with this email already exists.');
    }
    throw error;
  }
}));

// ===============================
// Skin analysis
// ===============================
app.post('/api/skin-analysis', asyncHandler(async (req, res) => {
  try {
    const analysis = new SkinAnalysis(req.body);
    const savedAnalysis = await analysis.save();
    return res.status(201).json(savedAnalysis);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}));

app.get('/api/admin/skin-analysis', authenticateAdmin, asyncHandler(async (req, res) => {
  const analyses = await SkinAnalysis.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return res.json({ totalAnalyses: analyses.length, analyses });
}));

// ===============================
// Reports - admin only
// ===============================
app.post('/api/admin/reports', authenticateAdmin, asyncHandler(async (req, res) => {
  try {
    const { user, skinAnalysis, title, summary, recommendations, status } = req.body;
    const report = new Report({
      user, skinAnalysis, title, summary, recommendations, status
    });
    const savedReport = await report.save();
    return res.status(201).json(savedReport);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}));

app.get('/api/admin/reports', authenticateAdmin, asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('user', 'name email')
    .populate('skinAnalysis', 'skinType analysisResult')
    .sort({ createdAt: -1 });

  return res.json({ totalReports: reports.length, reports });
}));

app.get('/api/admin/reports/:id', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'INVALID_REPORT_ID', 'The report ID is invalid.');
  }

  const report = await Report.findById(req.params.id)
    .populate('user', 'name email')
    .populate('skinAnalysis', 'skinType analysisResult recommendations');

  if (!report) {
    throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found.');
  }

  return res.json(report);
}));

// ===============================
// Admin dashboard stats
// ===============================
app.get('/api/admin/stats', authenticateAdmin, asyncHandler(async (req, res) => {
  const [totalUsers, totalAnalyses, totalReports] = await Promise.all([
    User.countDocuments(),
    SkinAnalysis.countDocuments(),
    Report.countDocuments()
  ]);

  return res.json({ totalUsers, totalAnalyses, totalReports });
}));

// ===============================
// Admin users API - admin only
// ===============================
app.get('/api/admin/users', authenticateAdmin, asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });

  return res.json({ success: true, totalUsers: users.length, users });
}));

// ===============================
// Admin content API - admin only
// ===============================
const cleanContentBody = (body) => {
  const data = { ...(body || {}) };
  delete data._id;
  delete data.__v;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
};

const handleContentWriteError = (error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    throw new ApiError(400, 'INVALID_CONTENT', error.message);
  }
  throw error;
};

app.get('/api/admin/content', authenticateAdmin, asyncHandler(async (req, res) => {
  const content = await Content.find({}).sort({ createdAt: -1 });
  return res.json({
    success: true,
    contents: content,
    content,
    items: content,
    total: content.length
  });
}));

app.post('/api/admin/content', authenticateAdmin, asyncHandler(async (req, res) => {
  try {
    const saved = await new Content(cleanContentBody(req.body)).save();
    return res.status(201).json(saved);
  } catch (error) {
    return handleContentWriteError(error);
  }
}));

app.put('/api/admin/content/:id', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  }

  try {
    const updated = await Content.findByIdAndUpdate(
      req.params.id,
      cleanContentBody(req.body),
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
    }

    return res.json(updated);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return handleContentWriteError(error);
  }
}));

app.patch('/api/admin/content/:id/status', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  }

  const { status } = req.body || {};
  if (!['draft', 'published'].includes(status)) {
    throw new ApiError(400, 'INVALID_STATUS', 'Status must be "draft" or "published".');
  }

  const updated = await Content.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
  }

  return res.json(updated);
}));

app.delete('/api/admin/content/:id', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  }

  const deleted = await Content.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
  }

  return res.json({ success: true, message: 'Content deleted successfully' });
}));

// ===============================
// Admin profile - admin only
// ===============================
const formatAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: 'admin',
});

app.get('/api/admin/profile', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.admin.id)) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Invalid session. Please log in again.');
  }

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    throw new ApiError(404, 'ADMIN_NOT_FOUND', 'Admin account not found.');
  }

  return res.json({ admin: formatAdmin(admin) });
}));

app.put('/api/admin/profile', authenticateAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.admin.id)) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Invalid session. Please log in again.');
  }

  const { name, email, password } = req.body || {};
  const updates = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new ApiError(400, 'INVALID_NAME', 'Name cannot be empty.');
    }
    updates.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ApiError(400, 'INVALID_EMAIL', 'Enter a valid email address.');
    }

    const duplicate = await Admin.findOne({
      email: normalizedEmail,
      _id: { $ne: req.admin.id },
    });
    if (duplicate) {
      throw new ApiError(409, 'EMAIL_IN_USE', 'Another admin already uses this email.');
    }
    updates.email = normalizedEmail;
  }

  if (password !== undefined && password !== '') {
    if (typeof password !== 'string' || password.length < 8) {
      throw new ApiError(400, 'WEAK_PASSWORD', 'Password must be at least 8 characters.');
    }
    updates.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'NO_CHANGES', 'No changes were provided.');
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!admin) {
    throw new ApiError(404, 'ADMIN_NOT_FOUND', 'Admin account not found.');
  }

  return res.json({ message: 'Profile updated successfully', admin: formatAdmin(admin) });
}));

// ===============================
// Sample API route
// ===============================
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node + Express backend!' });
});

// ===============================
// Image API
// ===============================
app.post('/api/images', asyncHandler(async (req, res) => {
  const { userId, fileName, contentType, imageData } = req.body ?? {};

  if (typeof userId !== 'string' || !userId.trim() || userId.length > 128) {
    throw new ApiError(400, 'INVALID_USER_ID', 'A valid userId is required.');
  }
  if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 255) {
    throw new ApiError(400, 'INVALID_FILE_NAME', 'A valid fileName is required.');
  }
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new ApiError(415, 'UNSUPPORTED_IMAGE_TYPE', 'Upload a JPG, PNG, or WEBP image.');
  }
  if (typeof imageData !== 'string' ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(imageData)) {
    throw new ApiError(400, 'INVALID_IMAGE_DATA', 'Image data must be valid base64.');
  }

  const imageBytes = Buffer.from(imageData, 'base64');
  if (imageBytes.length === 0 || imageBytes.length > MAX_IMAGE_BYTES) {
    throw new ApiError(413, 'IMAGE_SIZE_LIMIT', 'Image must be 10 MB or smaller.');
  }
  if (!matchesImageType(imageBytes, contentType)) {
    throw new ApiError(400, 'INVALID_IMAGE', 'The image content does not match its declared file type.');
  }

  const savedImage = await new Image({
    userId: userId.trim(),
    fileName: fileName.trim(),
    contentType,
    imageData: imageBytes
  }).save();

  return res.status(201).json({
    message: 'Image saved successfully',
    imageId: savedImage._id
  });
}));

app.get('/api/images/:imageId', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) {
    throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  }

  const image = await Image.findById(req.params.imageId).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');

  res.set('Content-Type', image.contentType);
  res.set('Cache-Control', 'private, no-store');
  return res.send(image.imageData);
}));

app.post('/api/images/:imageId/analyze', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) {
    throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  }

  const image = await Image.findById(req.params.imageId).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');

  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  let response;

  try {
    response = await fetch(`${mlServiceUrl.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': image.contentType,
        'X-Request-Id': res.locals.requestId
      },
      body: image.imageData,
      signal: AbortSignal.timeout(30000)
    });
  } catch {
    throw new ApiError(503, 'ML_SERVICE_UNAVAILABLE',
      'Image analysis is temporarily unavailable.');
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    if (response.status < 500) {
      throw new ApiError(
        response.status,
        detail?.error?.code || 'IMAGE_ANALYSIS_FAILED',
        detail?.error?.message || 'Image analysis failed.'
      );
    }
    throw new ApiError(502, 'ML_SERVICE_ERROR',
      'Image analysis could not be completed.');
  }

  return res.json({
    imageId: image._id,
    imageUrl: `/api/images/${image._id}`,
    ...(await response.json())
  });
}));

// ===============================
// 404 handler
// ===============================
app.use((req, res, next) => {
  next(new ApiError(404, 'NOT_FOUND', 'The requested resource was not found.'));
});

// ===============================
// Error handler
// ===============================
app.use((error, req, res, next) => {
  const requestId = res.locals.requestId || crypto.randomUUID();
  const status = Number.isInteger(error.status) ? error.status : 500;
  const code = error instanceof ApiError
    ? error.code
    : status === 413
      ? 'PAYLOAD_TOO_LARGE'
      : status === 400
        ? 'INVALID_REQUEST'
        : status >= 500
          ? 'INTERNAL_SERVER_ERROR'
          : 'REQUEST_ERROR';

  const message = status >= 500
    ? 'An unexpected server error occurred.'
    : error instanceof ApiError
      ? error.message
      : status === 413
        ? 'Request body exceeds the allowed size.'
        : status === 400
          ? 'Request body is invalid.'
          : 'The request could not be processed.';

  if (status >= 500) console.error(`[${requestId}]`, error);
  return res.status(status).json({ error: { code, message, requestId } });
});

// ===============================
// Start server
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});