const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seed = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  const admin = new User({ name: 'Ricardo', email, password: hashed, role: 'admin' });
  await admin.save();
  console.log('Admin created:', email);
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
