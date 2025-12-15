const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('../routes/auth');

// Only load .env locally
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
  // ignore read-only FS
}
process.env.UPLOAD_DIR = uploadDir;

// CORS
app.use(cors({ origin: true, credentials: true }));
// NOTE: app.options('*') not supported in express 5.2.1; cors() middleware handles preflight
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// MongoDB cached connection
let mongoConnected = false;
const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return true;
    console.log('[MongoDB] Connecting...');
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

// Health check (no DB)
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Ping endpoint
app.get('/api/ping', (req, res) => res.json({
  ok: true,
  mongoUri: !!process.env.MONGODB_URI,
  jwtSecret: !!process.env.JWT_SECRET
}));

// Auth routes (with DB connection middleware)
app.use('/api/auth', async (req, res, next) => {
  if (!mongoConnected && !await connectMongoDB()) {
    return res.status(500).json({ error: 'Database unavailable' });
  }
  next();
}, authRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
