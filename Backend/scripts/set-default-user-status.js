require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();
    console.log('Conectado a la DB, actualizando usuarios sin status...');

    const res = await User.updateMany(
      { $or: [ { status: { $exists: false } }, { status: null } ] },
      { $set: { status: 'active' } }
    );

    console.log(`Usuarios modificados: ${res.modifiedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error al actualizar usuarios:', err);
    process.exit(1);
  }
};

run();
