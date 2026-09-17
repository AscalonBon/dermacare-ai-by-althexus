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
    },

    contentType: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Image', imageSchema);