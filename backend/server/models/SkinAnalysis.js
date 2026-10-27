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
      enum: ["normal", "dry", "oily", "combination", "sensitive", "not_assessed"],
      default: "not_assessed",
    },

    analysisResult: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
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