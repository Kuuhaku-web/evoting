const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('../routes/auth');

// Only load .env locally; Vercel injects env vars directly into process.env
if (!process.env.VERCEL) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

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

// Basic CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Add vercel.app domains
corsOptions.origin.push(function (origin, callback) {
  if (!origin || origin.includes('.vercel.app')) {
    callback(null, true);
  } else {
    callback(null, corsOptions.origin.includes(origin));
  }
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection (cached)
let mongoConnected = false;
const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    console.log('[MongoDB] Attempting connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evoting', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    mongoConnected = true;
    console.log('[MongoDB] Connected');
    return true;
  } catch (err) {
    console.error('[MongoDB] Error:', err.message);
    return false;
  }
};

// Simple health check (no DB required)
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running', status: 'ok' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Ping (show env loaded)
app.get('/api/ping', (req, res) => {
  res.json({
    ok: true,
    mongoUri: !!process.env.MONGODB_URI,
    jwtSecret: !!process.env.JWT_SECRET,
    vercelEnv: !!process.env.VERCEL
  });
});

// API routes with DB connection
app.use('/api/auth', async (req, res, next) => {
  if (!mongoConnected && !await connectMongoDB()) {
    return res.status(500).json({ error: 'Database unavailable' });
  }
  next();
}, authRoutes);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
