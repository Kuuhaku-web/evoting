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
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'https://evoting-iota.vercel.app',
      'https://evoting-git-main-edwins-projects-0fa94835.vercel.app',
      'https://evoting-6e3ssq38e-edwins-projects-0fa94835.vercel.app'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running', status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// MongoDB Connection
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evoting', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    mongoConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    mongoConnected = false;
    return false;
  }
};

// Middleware untuk ensure MongoDB connected (untuk setiap request)
app.use(async (req, res, next) => {
  if (!mongoConnected) {
    await connectMongoDB();
  }
  next();
});

module.exports = app;
