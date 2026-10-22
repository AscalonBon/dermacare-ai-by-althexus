
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // Avoid hashing an existing bcrypt hash a second time.
  if (
    typeof this.password === "string" &&
    /^\$2[aby]\$\d{2}\$/.test(this.password)
  ) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
