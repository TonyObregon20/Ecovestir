const mongoose = require('mongoose');

// Product schema: campos básicos para un e-commerce de ropa/ecoproductos.
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: String,
  sizes: [String],
  images: [String], // URLs a CDN/Cloudinary/S3
  material: String,
  ecoFriendly: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
