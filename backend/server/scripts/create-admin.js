require('dotenv').config();

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../lib/mongodb');

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password || password.length < 12) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL must be a valid email address.');
  }

  await connectDB();
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error('An administrator already exists with that email.');

  await new Admin({ name, email, password }).save();
  console.log(`Created administrator account for ${email}.`);
}

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
