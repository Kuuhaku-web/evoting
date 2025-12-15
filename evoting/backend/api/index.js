const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Only load .env locally
if (!process.env.VERCEL) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const app = express();

// CORS
app.use(cors({ origin: true, credentials: true }));
// app.options('*') tidak support di Express 5; cors() middleware udah handle preflight
app.use(express.json());

// Routes
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.get('/api/ping', (req, res) => res.json({ mongoUri: !!process.env.MONGODB_URI, jwtSecret: !!process.env.JWT_SECRET }));

// Error
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
