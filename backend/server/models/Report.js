const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skinAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkinAnalysis",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    recommendations: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["generated", "reviewed"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;