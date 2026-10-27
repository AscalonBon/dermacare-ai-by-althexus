const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    age: {
      type: Number,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    skinType: {
      type: String,
      enum: ["normal", "dry", "oily", "combination", "sensitive"],
    },

    avatarDataUrl: {
      type: String,
      maxlength: 2800000,
    },

    privacyConsentAt: Date,

    privacyConsentVersion: {
      type: String,
      maxlength: 32,
    },

    // Last time the user performed an activity
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    // User account status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", function () {
  if (!this.passwordHash && !this.googleId) {
    this.invalidate("passwordHash", "An account requires a password or a linked Google account.");
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;