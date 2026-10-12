require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('node:crypto');
const User = require('./models/User');
const Image = require('./models/image');
const SkinAnalysis = require('./models/SkinAnalysis');
const Report = require('./models/Report');
const connectDB = require('./lib/mongodb');
const {
  createAuthToken,
  getAuthUserId,
  getTokenSecret,
  hashPassword,
  verifyPassword,
} = require('./lib/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_ORIGINS = new Set([
  'https://dermacare-ai-by-althexus.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function matchesImageType(imageBytes, contentType) {
  if (contentType === 'image/jpeg') {
    return imageBytes.length >= 3 && imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
  }
  if (contentType === 'image/png') {
    return imageBytes.length >= 8 && imageBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (contentType === 'image/webp') {
    return imageBytes.length >= 12
      && imageBytes.toString('ascii', 0, 4) === 'RIFF'
      && imageBytes.toString('ascii', 8, 12) === 'WEBP';
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

// ===============================
// Middleware
// ===============================
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || ALLOWED_ORIGINS.has(origin));
  },
}));
app.use((req, res, next) => {
  res.locals.requestId = crypto.randomUUID();
  res.set('X-Request-Id', res.locals.requestId);
  next();
});
app.use(express.json({ limit: '4200kb' }));

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: mongoose.connection.readyState === 1 });
  } catch (error) {
    console.error(`[${res.locals.requestId}] MongoDB health check failed`, error);
    res.status(503).json({ ok: false, error: error.message });
  }
});

async function requireDatabase(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}

function requireUserAuthentication(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const userId = match ? getAuthUserId(match[1]) : null;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Sign in to continue.'));
  }
  req.authenticatedUserId = userId;
  next();
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

async function registerUser(req, res) {
  const { name, email, password } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    throw new ApiError(400, 'INVALID_NAME', 'Enter your name (up to 100 characters).');
  }
  if (typeof email !== 'string' || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new ApiError(400, 'INVALID_EMAIL', 'Enter a valid email address.');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    throw new ApiError(400, 'INVALID_PASSWORD', 'Password must be between 8 and 128 characters.');
  }

  try {
    getTokenSecret();
  } catch (error) {
    throw new ApiError(503, 'AUTH_NOT_CONFIGURED', error.message);
  }

  const user = new User({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(password),
  });
  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'EMAIL_ALREADY_REGISTERED', 'An account with this email already exists.');
    }
    throw error;
  }

  res.status(201).json({ user: publicUser(user), token: createAuthToken(user._id.toString()) });
}

async function loginUser(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw new ApiError(400, 'INVALID_CREDENTIALS', 'Enter your email and password.');
  }
  try {
    getTokenSecret();
  } catch (error) {
    throw new ApiError(503, 'AUTH_NOT_CONFIGURED', error.message);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }

  res.json({ user: publicUser(user), token: createAuthToken(user._id.toString()) });
}

function authenticateAdmin(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey) {
    return next(new ApiError(503, 'ADMIN_AUTH_NOT_CONFIGURED', 'Admin API authentication is not configured.'));
  }

  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'A valid admin bearer token is required.'));
  }

  const expected = Buffer.from(configuredKey);
  const actual = Buffer.from(match[1]);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'A valid admin bearer token is required.'));
  }
  next();
}

// ===============================
// User authentication
// ===============================
app.use('/api/auth', requireDatabase);
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/me', requireUserAuthentication, async (req, res, next) => {
  try {
    const user = await User.findById(req.authenticatedUserId);
    if (!user || !user.isActive) {
      return next(new ApiError(401, 'UNAUTHORIZED', 'This account is unavailable.'));
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

// ===============================
// Create Skin Analysis
// ===============================
app.use('/api/skin-analysis', requireDatabase);
app.post(
  '/api/skin-analysis',
  async (req, res) => {
    try {
      const analysis =
        new SkinAnalysis(req.body);

      const savedAnalysis =
        await analysis.save();

      res.status(201).json(savedAnalysis);

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Get All Skin Analyses - Admin Only
// ===============================
app.use('/api/admin', authenticateAdmin, requireDatabase);
app.get(
  '/api/admin/skin-analysis',
  async (req, res) => {
    try {
      const analyses =
        await SkinAnalysis.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 });

      res.json({
        totalAnalyses: analyses.length,
        analyses
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Create Report - Admin Only
// ===============================
app.post(
  '/api/admin/reports',
  async (req, res) => {
    try {
      const {
        user,
        skinAnalysis,
        title,
        summary,
        recommendations,
        status
      } = req.body;

      const report = new Report({
        user,
        skinAnalysis,
        title,
        summary,
        recommendations,
        status
      });

      const savedReport =
        await report.save();

      res.status(201).json(savedReport);

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Get All Reports - Admin Only
// ===============================
app.get(
  '/api/admin/reports',
  async (req, res) => {
    try {
      const reports =
        await Report.find()
          .populate('user', 'name email')
          .populate(
            'skinAnalysis',
            'skinType analysisResult'
          )
          .sort({ createdAt: -1 });

      res.json({
        totalReports: reports.length,
        reports
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Get Single Report - Admin Only
// ===============================
app.get(
  '/api/admin/reports/:id',
  async (req, res) => {
    try {
      const report =
        await Report.findById(req.params.id)
          .populate(
            'user',
            'name email'
          )
          .populate(
            'skinAnalysis',
            'skinType analysisResult recommendations'
          );

      if (!report) {
        return res.status(404).json({
          error: 'Report not found'
        });
      }

      res.json(report);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Sample API Route
// ===============================
app.get('/api/message', (req, res) => {
  res.json({
    message:
      'Hello from the Node + Express backend!'
  });
});

// ===============================
// Image API
app.use('/api/images', requireDatabase, requireUserAuthentication);
app.post('/api/images', async (req, res) => {
  const { fileName, contentType, imageData } = req.body ?? {};
  if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 255) {
    throw new ApiError(400, 'INVALID_FILE_NAME', 'A valid fileName is required.');
  }
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new ApiError(415, 'UNSUPPORTED_IMAGE_TYPE', 'Upload a JPG, PNG, or WEBP image.');
  }
  if (typeof imageData !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(imageData)) {
    throw new ApiError(400, 'INVALID_IMAGE_DATA', 'Image data must be valid base64.');
  }

  const imageBytes = Buffer.from(imageData, 'base64');
  if (imageBytes.length === 0 || imageBytes.length > MAX_IMAGE_BYTES) {
    throw new ApiError(413, 'IMAGE_SIZE_LIMIT', 'Image must be 3 MB or smaller.');
  }
  if (!matchesImageType(imageBytes, contentType)) {
    throw new ApiError(400, 'INVALID_IMAGE', 'The image content does not match its declared file type.');
  }

  const savedImage = await new Image({
    userId: req.authenticatedUserId,
    fileName: fileName.trim(),
    contentType,
    imageData: imageBytes,
  }).save();

  res.status(201).json({
    message: 'Image saved successfully',
    imageId: savedImage._id,
  });
});

app.get('/api/images/:imageId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) {
    throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  }

  const image = await Image.findById(req.params.imageId).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  if (image.userId !== req.authenticatedUserId) {
    throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  }

  res.set('Content-Type', image.contentType);
  res.set('Cache-Control', 'private, no-store');
  res.send(image.imageData);
});

app.post('/api/images/:imageId/analyze', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.imageId)) {
    throw new ApiError(400, 'INVALID_IMAGE_ID', 'The image ID is invalid.');
  }

  const image = await Image.findById(req.params.imageId).select('contentType imageData');
  if (!image) throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  if (image.userId !== req.authenticatedUserId) {
    throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found.');
  }

  if (!process.env.ML_SERVICE_URL) {
    throw new ApiError(503, 'ML_SERVICE_NOT_CONFIGURED', 'Image analysis service is not configured.');
  }
  const mlServiceUrl = process.env.ML_SERVICE_URL;
  let response;
  try {
    response = await fetch(`${mlServiceUrl.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': image.contentType,
        'X-Request-Id': res.locals.requestId,
      },
      body: image.imageData,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new ApiError(503, 'ML_SERVICE_UNAVAILABLE', 'Image analysis is temporarily unavailable.');
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    if (response.status < 500) {
      throw new ApiError(response.status, detail?.error?.code || 'IMAGE_ANALYSIS_FAILED', detail?.error?.message || 'Image analysis failed.');
    }
    throw new ApiError(502, 'ML_SERVICE_ERROR', 'Image analysis could not be completed.');
  }

  res.json({
    imageId: image._id,
    imageUrl: `/api/images/${image._id}`,
    ...(await response.json()),
  });
});

app.use((req, res, next) => {
  next(new ApiError(404, 'NOT_FOUND', 'The requested resource was not found.'));
});

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
  res.status(status).json({ error: { code, message, requestId } });
});

// Start Server
// ===============================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;