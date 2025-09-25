const mongoose = require('mongoose');

// User schema: almacenar email en minúsculas y forzar unicidad para evitar duplicados.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  // role permite implementar control de acceso (RBAC) básico
  role: { type: String, enum: ['customer','admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
