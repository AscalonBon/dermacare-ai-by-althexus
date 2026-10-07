require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Admin = require('./models/Admin');
const SkinAnalysis = require('./models/SkinAnalysis');
const Report = require('./models/Report');
const Content = require('./models/Content');

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

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

// ===============================
// User Profile API
// ===============================
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// ===============================
// Admin Creation API
// ===============================
app.post('/api/admins', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    const savedAdmin = await admin.save();

    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// ===============================
// Admin Login API
// ===============================
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim()
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ===============================
// Admin Authorization Middleware
// ===============================
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};

// ===============================
// Update Admin Profile
// ===============================
app.put(
  '/api/admin/profile',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const admin = await Admin.findById(req.admin.id);

      if (!admin) {
        return res.status(404).json({
          error: 'Admin not found'
        });
      }

      // Update name
      if (name && name.trim()) {
        admin.name = name.trim();
      }

      // Update email
      if (email && email.trim()) {
        const newEmail = email.toLowerCase().trim();

        const existingAdmin = await Admin.findOne({
          email: newEmail,
          _id: { $ne: admin._id }
        });

        if (existingAdmin) {
          return res.status(409).json({
            error: 'Email is already in use'
          });
        }

        admin.email = newEmail;
      }

      // Update password
      if (password && password.trim()) {
        admin.password = password.trim();
      }

      const updatedAdmin = await admin.save();

      res.json({
        message: 'Admin profile updated successfully',
        admin: {
          id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role
        }
      });

    } catch (error) {
      console.error('Admin profile update error:', error);

      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Protected Admin Dashboard API
// ===============================
app.get(
  '/api/admin/dashboard',
  authenticateAdmin,
  (req, res) => {
    res.json({
      message: 'Welcome to the Admin Dashboard',
      admin: req.admin
    });
  }
);

// ===============================
// Get All Users - Admin Only
// ===============================
app.get(
  '/api/admin/users',
  authenticateAdmin,
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-__v')
        .sort({ createdAt: -1 });

      res.json({
        totalUsers: users.length,
        users
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Admin Dashboard Stats
// ===============================
app.get(
  '/api/admin/stats',
  authenticateAdmin,
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const totalAnalyses =
        await SkinAnalysis.countDocuments();

      const activeUsers =
        await User.countDocuments({
          isActive: true,
          lastActiveAt: {
            $gte: new Date(
              Date.now() -
              30 * 24 * 60 * 60 * 1000
            )
          }
        });

      const recentUsers =
        await User.find()
          .select('-__v')
          .sort({ createdAt: -1 })
          .limit(5);

      const totalContent =
        await Content.countDocuments();

      const publishedContent =
        await Content.countDocuments({
          status: 'published'
        });

      const draftContent =
        await Content.countDocuments({
          status: 'draft'
        });

      res.json({
        totalUsers,
        totalAnalyses,
        activeUsers,
        recentUsers,
        totalContent,
        publishedContent,
        draftContent
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
);
      
// ==================================================
// ADMIN CONTENT MANAGEMENT
// ==================================================

// ===============================
// Get All Content
// ===============================
app.get(
  '/api/admin/content',
  authenticateAdmin,
  async (req, res) => {
    try {
      const contents = await Content.find()
        .sort({ createdAt: -1 });

      res.json({
        totalContent: contents.length,
        contents
      });

    } catch (error) {
      console.error('Get content error:', error);

      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Create Content
// ===============================
app.post(
  '/api/admin/content',
  authenticateAdmin,
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        content,
        status
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          error: 'Title is required'
        });
      }

      if (!category || !category.trim()) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      const newContent = new Content({
        title: title.trim(),
        category: category.trim(),
        description: description || '',
        content: content || '',
        status:
          status === 'published'
            ? 'published'
            : 'draft'
      });

      const savedContent =
        await newContent.save();

      res.status(201).json({
        message: 'Content created successfully',
        content: savedContent
      });

    } catch (error) {
      console.error('Create content error:', error);

      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Update Content
// ===============================
app.put(
  '/api/admin/content/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        content,
        status
      } = req.body;

      const existingContent =
        await Content.findById(req.params.id);

      if (!existingContent) {
        return res.status(404).json({
          error: 'Content not found'
        });
      }

      if (title !== undefined) {
        if (!title.trim()) {
          return res.status(400).json({
            error: 'Title cannot be empty'
          });
        }

        existingContent.title = title.trim();
      }

      if (category !== undefined) {
        if (!category.trim()) {
          return res.status(400).json({
            error: 'Category cannot be empty'
          });
        }

        existingContent.category =
          category.trim();
      }

      if (description !== undefined) {
        existingContent.description =
          description;
      }

      if (content !== undefined) {
        existingContent.content = content;
      }

      if (status !== undefined) {
        if (
          !['draft', 'published'].includes(status)
        ) {
          return res.status(400).json({
            error:
              'Status must be draft or published'
          });
        }

        existingContent.status = status;
      }

      const updatedContent =
        await existingContent.save();

      res.json({
        message: 'Content updated successfully',
        content: updatedContent
      });

    } catch (error) {
      console.error('Update content error:', error);

      res.status(400).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Delete Content
// ===============================
app.delete(
  '/api/admin/content/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const deletedContent =
        await Content.findByIdAndDelete(
          req.params.id
        );

      if (!deletedContent) {
        return res.status(404).json({
          error: 'Content not found'
        });
      }

      res.json({
        message: 'Content deleted successfully'
      });

    } catch (error) {
      console.error('Delete content error:', error);

      res.status(500).json({
        error: error.message
      });
    }
  }
);

// ===============================
// Change Content Status
// ===============================
app.patch(
  '/api/admin/content/:id/status',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        !['draft', 'published'].includes(status)
      ) {
        return res.status(400).json({
          error:
            'Status must be draft or published'
        });
      }

      const updatedContent =
        await Content.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true
          }
        );

      if (!updatedContent) {
        return res.status(404).json({
          error: 'Content not found'
        });
      }

      res.json({
        message:
          'Content status updated successfully',
        content: updatedContent
      });

    } catch (error) {
      console.error(
        'Content status update error:',
        error
      );

      res.status(500).json({
        error: error.message
      });
    }
  }
);
// ===============================
// Public Content API
// ===============================
app.get('/api/content', async (req, res) => {
  try {
    const contents = await Content.find({
      status: 'published'
    }).sort({ createdAt: -1 });

    res.json({
      totalContent: contents.length,
      contents
    });

  } catch (error) {
    console.error('Public content error:', error);

    res.status(500).json({
      error: error.message
    });
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
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});