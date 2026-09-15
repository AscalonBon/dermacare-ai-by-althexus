require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => console.error(' MongoDB connection error:', err));

// User Profile API
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sample API Route
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node + Express backend!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});