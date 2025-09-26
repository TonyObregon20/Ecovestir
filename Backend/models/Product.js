const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "El nombre es obligatorio"], unique: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: [0, "El precio no puede ser negativo"] },
  stock: { type: Number, default: 0, min: [0, "El stock no puede ser negativo"] },
  category: { type: String, enum: ["camisetas", "pantalones", "accesorios", "otros"], default: "otros" },
  sizes: { type: [String], enum: ["S", "M", "L", "XL"], default: [] },
  images: { type: [String], default: [] }, // URLs
  material: { type: String, trim: true },
  ecoFriendly: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
