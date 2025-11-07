const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "El nombre es obligatorio"], unique: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: [0, "El precio no puede ser negativo"] },
  stock: { type: Number, default: 0, min: [0, "El stock no puede ser negativo"] },  // Será calculado automáticamente desde sizeStock
  sizeStock: [{
    size: { type: String, enum: ["S", "M", "L", "XL"], required: true },
    stock: { type: Number, required: true, default: 0, min: [0, "El stock no puede ser negativo"] }
  }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
  sizes: { type: [String], enum: ["S", "M", "L", "XL"], default: [] }, // Se calcula automáticamente desde sizeStock en el middleware pre-save
  images: { type: [String], default: [] },
  material: { type: String, trim: true },
  ecoFriendly: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Campo calculado dinámicamente (no se guarda en DB), suma automáticamente el stock de todas las tallas, se usa como producto.totalStock 
productSchema.virtual('totalStock').get(function() {
  if (this.sizeStock && this.sizeStock.length > 0) {   // Si el producto tiene sizeStock, sumar todos los stocks
    return this.sizeStock.reduce((sum, item) => sum + item.stock, 0);
  }
  return this.stock || 0;
});

// Incluir campos virtuales al convertir a JSON/Object, sin esto totalStock no aparecería en las respuestas de la API
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// MIDDLEWARE PRE-SAVE: Se ejecuta automáticamente antes de guardar un producto, mantiene sincronizados los campos (stock, sizes) con sizeStock
productSchema.pre('save', function(next) {
  // Si tiene sizeStock, actualizar campos sizes y stock automáticamente
  if (this.sizeStock && this.sizeStock.length > 0) {
    this.stock = this.sizeStock.reduce((sum, item) => sum + item.stock, 0);
    this.sizes = this.sizeStock.map(item => item.size);
  }
  next();
});

// Indices: Mejoran el rendimiento de las búsquedas en la base de datos
productSchema.index({ category: 1 });         // Búsqueda por categoría
productSchema.index({ 'sizeStock.size': 1 }); // Búsqueda por talla específica
productSchema.index({ ecoFriendly: 1 });      // Filtrar productos ecológicos
productSchema.index({ isActive: 1 });         // Filtrar productos activos

module.exports = mongoose.model("Product", productSchema);
