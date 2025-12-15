const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');

// Load .env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('📝 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ NOT SET');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET');

const app = express();

// Create uploads folder jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads folder');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);

// ===== IMPROVED: MongoDB Connection dengan Retry Logic =====
const connectMongoDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evoting', {
      // ===== ADD OPTIONS =====
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📍 Database: evoting`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // Log specific error
    if (err.code === 'ETIMEOUT' || err.code === 'ENOTFOUND') {
      console.error('⚠️ Network error - Pastikan:');
      console.error('   1. IP Anda sudah di-whitelist di MongoDB Atlas Network Access');
      console.error('   2. Connection string benar: mongodb+srv://user:pass@cluster.mongodb.net/dbname');
      console.error('   3. Username & password benar (tanpa special characters atau escape them)');
      console.error('   4. Internet connection stabil');
    }
    
    return false;
  }
};

// Connect with retry
let retries = 0;
const maxRetries = 3;

const startServer = async () => {
  const connected = await connectMongoDB();
  
  if (!connected && retries < maxRetries) {
    retries++;
    console.log(`🔄 Retry ${retries}/${maxRetries} dalam 5 detik...`);
    setTimeout(startServer, 5000);
    return;
  }
  
  if (!connected && retries >= maxRetries) {
    console.error('❌ Failed to connect to MongoDB after 3 retries');
    console.error('⚠️ Server akan berjalan tapi database tidak tersedia');
    // Tetap start server untuk development
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('📚 API Routes:');
    console.log('   - POST /api/auth/register');
    console.log('   - POST /api/auth/login');
    console.log('   - GET  /api/auth/profile');
    console.log('   - POST /api/auth/upload-profile');
    console.log('   - POST /api/auth/delete-profile-picture\n');
  });
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});