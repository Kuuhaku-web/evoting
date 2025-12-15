const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('../routes/auth');

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Create uploads folder jika belum ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running', status: 'ok' });
});

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evoting', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Connect on startup (for local development)
if (!process.env.VERCEL) {
  connectMongoDB();
}

// For Vercel serverless, ensure connection on first request
let mongoConnected = false;
app.use(async (req, res, next) => {
  if (!mongoConnected && !process.env.VERCEL) {
    mongoConnected = await connectMongoDB();
  }
  next();
});

module.exports = app;
