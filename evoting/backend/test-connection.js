const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('🧪 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI);
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('\n✅ CONNECTION SUCCESS!');
  console.log('✓ MongoDB Atlas adalah accessible');
  console.log('✓ Database "evoting" ready to use');
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.log('\n❌ CONNECTION FAILED!');
  console.log(`Error: ${err.message}`);
  console.log(`Code: ${err.code}`);
  
  if (err.code === 'ETIMEOUT' || err.code === 'ENOTFOUND') {
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Cek IP whitelist di MongoDB Atlas Network Access');
    console.log('2. Cek connection string format');
    console.log('3. Cek username & password');
    console.log('4. Test internet connection: ping google.com');
  }
  process.exit(1);
});
