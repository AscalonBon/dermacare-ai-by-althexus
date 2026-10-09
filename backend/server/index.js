require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('node:crypto');
const User = require('./models/User');
const Image = require('./models/image');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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
app.use(cors());
app.use((req, res, next) => {
  res.locals.requestId = crypto.randomUUID();
  res.set('X-Request-Id', res.locals.requestId);
  next();
});
app.use(express.json({ limit: '14mb' }));

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.error('MongoDB connection error: MONGO_URI is not configured');
}

// ===============================
// User Profile API
// ===============================
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw new ApiError(400, 'INVALID_USER', error.message);
    }
    if (error.code === 11000) {
      throw new ApiError(409, 'USER_ALREADY_EXISTS', 'A user with this email already exists.');
    }
    throw error;
  }
});

// ===============================
// Create Skin Analysis
// ===============================
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
app.get(
  '/api/admin/skin-analysis',
  authenticateAdmin,
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
  authenticateAdmin,
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
  authenticateAdmin,
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
  authenticateAdmin,
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
app.post('/api/images', async (req, res) => {
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
  if (typeof imageData !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(imageData)) {
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

  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
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
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
  console.log(`Server running on port ${PORT}`);
});