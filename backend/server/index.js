require('dotenv').config();

const crypto = require('node:crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Image = require('./models/image');
const SkinAnalysis = require('./models/SkinAnalysis');
const Report = require('./models/Report');
const Content = require('./models/Content');
const Admin = require('./models/Admin');
const connectDB = require('./lib/mongodb');
const {
  createAdminToken,
  createAuthToken,
  getAdminFromToken,
  getAuthUserId,
  getTokenSecret,
  hashPassword,
  verifyPassword,
} = require('./lib/auth');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const CONSENT_VERSION = '1';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const googleOAuthClient = new OAuth2Client();
const configuredOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  'https://dermacareai.vercel.app',
  'https://dermacare-ai-by-althexus.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
]);

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts. Try again later.' } },
});
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Analysis limit reached. Try again later.' } },
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.'));
  },
}));
app.use((req, res, next) => {
  const requestId = req.get('X-Request-Id') || crypto.randomUUID();
  res.locals.requestId = requestId;
  res.set('X-Request-Id', requestId);
  next();
});
app.use(express.json({ limit: '14mb' }));

const requireDatabase = asyncHandler(async (req, res, next) => {
  await connectDB();
  next();
});

function getBearerToken(req) {
  const authorization = req.get('Authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
}

function authenticateUser(req, res, next) {
  const token = getBearerToken(req);
  const userId = token ? getAuthUserId(token) : null;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Sign in to continue.'));
  }
  req.authenticatedUserId = userId;
  return next();
}

function authenticateAdmin(req, res, next) {
  const token = getBearerToken(req);
  const admin = token ? getAdminFromToken(token) : null;
  if (!admin) {
    return next(new ApiError(401, 'ADMIN_AUTHENTICATION_REQUIRED', 'Sign in as an administrator to continue.'));
  }
  req.admin = admin;
  return next();
}

function matchesImageType(imageBytes, contentType) {
  if (contentType === 'image/jpeg') {
    return imageBytes.length >= 3 && imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
  }
  if (contentType === 'image/png') {
    return imageBytes.length >= 8 && imageBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (contentType === 'image/webp') {
    return imageBytes.length >= 12 && imageBytes.toString('ascii', 0, 4) === 'RIFF' && imageBytes.toString('ascii', 8, 12) === 'WEBP';
  }
  return false;
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    skinType: user.skinType,
    avatar: user.avatarDataUrl || null,
  };
}

function formatAdmin(admin) {
  return { id: admin._id, name: admin.name, email: admin.email, role: 'admin' };
}

function cleanContentBody(body) {
  const data = { ...(body || {}) };
  delete data._id;
  delete data.__v;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
}

app.get('/healthz', async (req, res) => {
  if (!process.env.MONGO_URI) {
    return res.status(503).json({ status: 'unavailable', database: 'not_configured' });
  }
  try {
    await connectDB();
    let aiService = 'not_configured';
    if (process.env.ML_SERVICE_URL && process.env.ML_SERVICE_API_KEY) {
      try {
        const aiResponse = await fetch(`${process.env.ML_SERVICE_URL.replace(/\/$/, '')}/healthz`, {
          signal: AbortSignal.timeout(3000),
        });
        aiService = aiResponse.ok ? 'healthy' : 'unhealthy';
      } catch {
        aiService = 'unavailable';
      }
    }
    const healthy = aiService === 'healthy';
    return res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      database: 'connected',
      aiService,
    });
  } catch {
    return res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});

app.get('/api/healthz', (req, res) => res.redirect(307, '/healthz'));
app.get('/api/message', (req, res) => res.json({ message: 'Hello from the Node + Express backend!' }));

app.post(['/api/auth/signup', '/api/auth/register'], authLimiter, requireDatabase, asyncHandler(async (req, res) => {
  const { name, email, password, privacyConsent } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw new ApiError(400, 'INVALID_NAME', 'Enter your name.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new ApiError(400, 'INVALID_EMAIL', 'Enter a valid email address.');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    throw new ApiError(400, 'WEAK_PASSWORD', 'Password must be between 8 and 128 characters.');
  }
  if (privacyConsent !== true) {
    throw new ApiError(400, 'CONSENT_REQUIRED', 'Accept the privacy notice to create an account.');
  }
  getTokenSecret();

  const user = new User({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    privacyConsentAt: new Date(),
    privacyConsentVersion: CONSENT_VERSION,
  });
  await user.save();
  return res.status(201).json({ token: createAuthToken(user._id.toString()), user: publicUser(user) });
}));

app.post('/api/auth/login', authLimiter, requireDatabase, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw new ApiError(400, 'INVALID_CREDENTIALS', 'Email and password are required.');
  }
  getTokenSecret();
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }
  user.lastActiveAt = new Date();
  await user.save();
  return res.json({ token: createAuthToken(user._id.toString()), user: publicUser(user) });
}));

app.post('/api/auth/google', authLimiter, requireDatabase, asyncHandler(async (req, res) => {
  const { idToken, credential } = req.body || {};
  const googleToken = idToken || credential;
  if (typeof googleToken !== 'string' || !process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(400, 'GOOGLE_AUTH_UNAVAILABLE', 'Google sign-in is not configured.');
  }
  getTokenSecret();
  const ticket = await googleOAuthClient.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
  const profile = ticket.getPayload();
  if (!profile?.email || !profile.email_verified || !profile.sub) {
    throw new ApiError(401, 'INVALID_GOOGLE_ACCOUNT', 'The Google account could not be verified.');
  }
  let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email.toLowerCase() }] });
  if (!user) {
    user = await new User({ name: profile.name || profile.email, email: profile.email, googleId: profile.sub }).save();
  } else if (!user.googleId) {
    user.googleId = profile.sub;
    await user.save();
  }
  if (!user.isActive) throw new ApiError(403, 'ACCOUNT_DISABLED', 'This account is disabled.');
  return res.json({ token: createAuthToken(user._id.toString()), user: publicUser(user) });
}));

app.get('/api/profile', authenticateUser, requireDatabase, asyncHandler(async (req, res) => {
  const user = await User.findById(req.authenticatedUserId);
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User account not found.');
  return res.json({ user: publicUser(user) });
}));

app.put('/api/profile', authenticateUser, requireDatabase, asyncHandler(async (req, res) => {
  const user = await User.findById(req.authenticatedUserId);
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User account not found.');
  const { name, age, gender, skinType, avatarDataUrl } = req.body || {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) throw new ApiError(400, 'INVALID_NAME', 'Enter a valid name.');
    user.name = name.trim();
  }
  if (age !== undefined) {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) throw new ApiError(400, 'INVALID_AGE', 'Age must be between 1 and 120.');
    user.age = parsedAge;
  }
  if (gender !== undefined) user.gender = gender;
  if (skinType !== undefined) user.skinType = skinType;
  if (avatarDataUrl !== undefined) {
    if (avatarDataUrl !== null && (
      typeof avatarDataUrl !== 'string' ||
      avatarDataUrl.length > 2_800_000 ||
      !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatarDataUrl)
    )) {
      throw new ApiError(400, 'INVALID_AVATAR', 'Choose a JPG, PNG, or WEBP image under 2 MB.');
    }
    user.avatarDataUrl = avatarDataUrl || undefined;
  }
  user.lastActiveAt = new Date();
  await user.save();
  return res.json({ user: publicUser(user) });
}));

app.get('/api/content', requireDatabase, asyncHandler(async (req, res) => {
  const contents = await Content.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
  return res.json({ contents });
}));

app.post('/api/admin/login', authLimiter, requireDatabase, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw new ApiError(400, 'INVALID_CREDENTIALS', 'Email and password are required.');
  }
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }
  const token = createAdminToken({ id: admin._id.toString(), email: admin.email, name: admin.name });
  return res.json({ message: 'Login successful', token, admin: formatAdmin(admin) });
}));

const adminRoute = [authenticateAdmin, requireDatabase];
app.get('/api/admin/dashboard', ...adminRoute, (req, res) => res.json({ admin: req.admin }));
app.get('/api/admin/profile', ...adminRoute, asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id) || await Admin.findOne({ email: req.admin.email });
  if (!admin) throw new ApiError(404, 'ADMIN_NOT_FOUND', 'Admin account not found.');
  return res.json({ admin: formatAdmin(admin) });
}));
app.put('/api/admin/profile', ...adminRoute, asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id) || await Admin.findOne({ email: req.admin.email });
  if (!admin) throw new ApiError(404, 'ADMIN_NOT_FOUND', 'Admin account not found.');
  const { name, email, password } = req.body || {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw new ApiError(400, 'INVALID_NAME', 'Name cannot be empty.');
    admin.name = name.trim();
  }
  if (email !== undefined) {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new ApiError(400, 'INVALID_EMAIL', 'Enter a valid email address.');
    const duplicate = await Admin.findOne({ email: normalizedEmail, _id: { $ne: admin._id } });
    if (duplicate) throw new ApiError(409, 'EMAIL_IN_USE', 'Another admin already uses this email.');
    admin.email = normalizedEmail;
  }
  if (password !== undefined && password !== '') {
    if (typeof password !== 'string' || password.length < 8) throw new ApiError(400, 'WEAK_PASSWORD', 'Password must be at least 8 characters.');
    admin.password = password;
  }
  await admin.save();
  return res.json({ message: 'Profile updated successfully', admin: formatAdmin(admin) });
}));

app.get('/api/admin/stats', ...adminRoute, asyncHandler(async (req, res) => {
  const activeSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [totalUsers, totalAnalyses, totalReports, activeUsers, recentUsers] = await Promise.all([
    User.countDocuments(),
    SkinAnalysis.countDocuments(),
    Report.countDocuments(),
    User.countDocuments({ isActive: true, lastActiveAt: { $gte: activeSince } }),
    User.find().select('name email isActive createdAt').sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  return res.json({ totalUsers, totalAnalyses, totalReports, activeUsers, recentUsers });
}));
app.get('/api/admin/users', ...adminRoute, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 }).lean();
  return res.json({ success: true, totalUsers: users.length, users });
}));
app.get('/api/admin/skin-analysis', ...adminRoute, asyncHandler(async (req, res) => {
  const analyses = await SkinAnalysis.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
  return res.json({ totalAnalyses: analyses.length, analyses });
}));
app.get('/api/admin/reports', ...adminRoute, asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('user', 'name email').populate('skinAnalysis', 'skinType analysisResult').sort({ createdAt: -1 }).lean();
  return res.json({ totalReports: reports.length, reports });
}));
app.post('/api/admin/reports', ...adminRoute, asyncHandler(async (req, res) => {
  const report = await new Report(req.body || {}).save();
  return res.status(201).json(report);
}));
app.get('/api/admin/reports/:id', ...adminRoute, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'INVALID_REPORT_ID', 'The report ID is invalid.');
  const report = await Report.findById(req.params.id).populate('user', 'name email').populate('skinAnalysis', 'skinType analysisResult recommendations').lean();
  if (!report) throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found.');
  return res.json(report);
}));

app.get('/api/admin/content', ...adminRoute, asyncHandler(async (req, res) => {
  const contents = await Content.find({}).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, contents, content: contents, items: contents, total: contents.length });
}));
app.post('/api/admin/content', ...adminRoute, asyncHandler(async (req, res) => {
  const content = await new Content(cleanContentBody(req.body)).save();
  return res.status(201).json(content);
}));
app.put('/api/admin/content/:id', ...adminRoute, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  const content = await Content.findByIdAndUpdate(req.params.id, cleanContentBody(req.body), { new: true, runValidators: true });
  if (!content) throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
  return res.json(content);
}));
app.patch('/api/admin/content/:id/status', ...adminRoute, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  const { status } = req.body || {};
  if (!['draft', 'published'].includes(status)) throw new ApiError(400, 'INVALID_STATUS', 'Status must be draft or published.');
  const content = await Content.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!content) throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
  return res.json(content);
}));
app.delete('/api/admin/content/:id', ...adminRoute, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'INVALID_CONTENT_ID', 'The content ID is invalid.');
  const content = await Content.findByIdAndDelete(req.params.id);
  if (!content) throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Content not found.');
  return res.json({ success: true, message: 'Content deleted successfully' });
}));

app.post('/api/skin-analysis', authenticateUser, requireDatabase, analysisLimiter, asyncHandler(async (req, res) => {
  const { skinType, analysisResult, recommendations } = req.body || {};
  if (analysisResult === undefined || analysisResult === null) throw new ApiError(400, 'INVALID_ANALYSIS', 'Analysis results are required.');
  const analysis = await new SkinAnalysis({
    user: req.authenticatedUserId,
    skinType: skinType || 'not_assessed',
    analysisResult,
    recommendations: Array.isArray(recommendations) ? recommendations : [],
  }).save();
  return res.status(201).json(analysis);
}));
app.get('/api/analyses', authenticateUser, requireDatabase, asyncHandler(async (req, res) => {
  const records = await SkinAnalysis.find({ user: req.authenticatedUserId }).sort({ createdAt: -1 }).limit(50).lean();
  const analyses = records.map((analysis) => ({
    ...analysis,
    imageUrl: analysis.image ? `/api/images/${analysis.image}` : null,
  }));
  return res.json({ analyses });
}));
app.get('/api/analyses/:analysisId', authenticateUser, requireDatabase, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.analysisId)) throw new ApiError(400, 'INVALID_ANALYSIS_ID', 'The analysis ID is invalid.');
  const analysis = await SkinAnalysis.findOne({ _id: req.params.analysisId, user: req.authenticatedUserId }).lean();
  if (!analysis) throw new ApiError(404, 'ANALYSIS_NOT_FOUND', 'Analysis not found.');
  return res.json({
    analysis: {
      ...analysis,
      imageUrl: analysis.image ? `/api/images/${analysis.image}` : null,
    },
  });
}));

app.use('/api/images', authenticateUser, requireDatabase);
app.post('/api/images', analysisLimiter, asyncHandler(async (req, res) => {
  const { fileName, contentType, imageData, privacyConsent } = req.body || {};
  if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 255) throw new ApiError(400, 'INVALID_FILE_NAME', 'A valid file name is required.');
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) throw new ApiError(415, 'UNSUPPORTED_IMAGE_TYPE', 'Upload a JPG, PNG, or WEBP image.');
  if (typeof imageData !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(imageData)) throw new ApiError(400, 'INVALID_IMAGE_DATA', 'Image data must be valid base64.');
  if (privacyConsent !== true) throw new ApiError(400, 'CONSENT_REQUIRED', 'Consent is required before uploading an image for analysis.');
  const imageBytes = Buffer.from(imageData, 'base64');
  if (imageBytes.length === 0 || imageBytes.length > MAX_IMAGE_BYTES) throw new ApiError(413, 'IMAGE_SIZE_LIMIT', 'Image must be 10 MB or smaller.');
  if (!matchesImageType(imageBytes, contentType)) throw new ApiError(400, 'INVALID_IMAGE', 'The image content does not match its declared file type.');
  const image = await new Image({
    userId: req.authenticatedUserId,
    fileName: fileName.trim(),
    contentType,
    imageData: imageBytes,
    privacyConsentAt: new Date(),
    privacyConsentVersion: CONSENT_VERSION,
  }).save();
  return res.status(201).json({ message: 'Image saved successfully', imageId: image._id });
}));

app.get('/api/images/:imageId', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  const image = await Image.findOne({ _id: req.params.imageId, userId: req.authenticatedUserId }).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  res.set('Content-Type', image.contentType);
  res.set('Cache-Control', 'private, no-store');
  return res.send(image.imageData);
}));

app.post('/api/images/:imageId/analyze', analysisLimiter, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  const image = await Image.findOne({ _id: req.params.imageId, userId: req.authenticatedUserId }).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  if (!process.env.ML_SERVICE_URL || !process.env.ML_SERVICE_API_KEY) throw new ApiError(503, 'ML_SERVICE_NOT_CONFIGURED', 'Image analysis service is not configured.');

  let response;
  try {
    response = await fetch(`${process.env.ML_SERVICE_URL.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': image.contentType,
        'X-Request-Id': res.locals.requestId,
        'X-API-Key': process.env.ML_SERVICE_API_KEY,
      },
      body: image.imageData,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new ApiError(503, 'ML_SERVICE_UNAVAILABLE', 'Image analysis is temporarily unavailable.');
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    if (response.status < 500) throw new ApiError(response.status, detail?.error?.code || 'IMAGE_ANALYSIS_FAILED', detail?.error?.message || 'Image analysis failed.');
    throw new ApiError(502, 'ML_SERVICE_ERROR', 'Image analysis could not be completed.');
  }

  const result = await response.json();
  const analysis = await new SkinAnalysis({
    user: req.authenticatedUserId,
    image: image._id,
    skinType: 'not_assessed',
    analysisResult: result,
    recommendations: [],
  }).save();
  return res.json({ imageId: image._id, imageUrl: `/api/images/${image._id}`, analysisId: analysis._id, ...result });
}));

app.use((req, res, next) => next(new ApiError(404, 'NOT_FOUND', 'The requested resource was not found.')));
app.use((error, req, res, next) => {
  const status = Number.isInteger(error.status) ? error.status : error.type === 'entity.too.large' ? 413 : 500;
  const code = error instanceof ApiError ? error.code : status === 413 ? 'PAYLOAD_TOO_LARGE' : status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR';
  const message = status >= 500 && !(error instanceof ApiError)
    ? 'An unexpected server error occurred.'
    : error instanceof ApiError ? error.message : status === 413 ? 'Request body exceeds the allowed size.' : 'The request could not be processed.';
  if (status >= 500) console.error(`[${res.locals.requestId || 'unknown'}]`, error);
  return res.status(status).json({ error: { code, message, requestId: res.locals.requestId } });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
