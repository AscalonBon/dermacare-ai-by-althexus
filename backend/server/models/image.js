const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      maxlength: 255,
    },

    contentType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/png', 'image/webp'],
    },

    imageData: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);