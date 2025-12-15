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

// Create uploads folder (use /tmp on Vercel serverless)
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (_) {
  // Ignore failures on read-only FS
}
process.env.UPLOAD_DIR = uploadDir;

// Middleware
// Izinkan semua origin localhost dan semua subdomain vercel.app
const corsOptions = {
  origin: function (origin, callback) {
    try {
      if (!origin) return callback(null, true);

      const isLocalhost = origin.startsWith('http://localhost:3000') || origin.startsWith('http://127.0.0.1:3000') || origin.startsWith('https://localhost:3000');
      const isVercel = /https?:\/\/([^.]+\.)*vercel\.app$/i.test(origin);

      if (isLocalhost || isVercel) {
        return callback(null, true);
      }
    } catch (e) {
      // Jika parsing gagal, tolak secara aman
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

// Attach common CORS headers so browsers see them
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(cors(corsOptions));

// Explicit preflight: respond with 204 and echo origin when allowed
app.options('*', (req, res) => {
  const origin = req.headers.origin || '';
  const allowed = origin && (origin.endsWith('.vercel.app') || origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000' || origin === 'https://localhost:3000');
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  return res.status(204).end();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);

// Root health check
app.get('/', (req, res) => {
  const origin = req.headers.origin;
  if (origin && (/https?:\/\/([^.]+\.)*vercel\.app$/i.test(origin) || origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000' || origin === 'https://localhost:3000')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.status(200).json({ message: 'Backend is running', status: 'ok' });
});

// Prevent favicon 500s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// MongoDB Connection with caching (serverless-friendly)
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      mongoConnected = true;
      return true;
    }
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
