const mongoose = require("mongoose");

const skinAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skinType: {
      type: String,
      enum: ["normal", "dry", "oily", "combination", "sensitive"],
      required: true,
    },

    analysisResult: {
      type: String,
      required: true,
      trim: true,
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const SkinAnalysis = mongoose.model(
  "SkinAnalysis",
  skinAnalysisSchema
);

module.exports = SkinAnalysis;