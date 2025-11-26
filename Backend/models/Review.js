const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // Información del autor
  author: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  
  // Contenido de la reseña
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [150, 'El título no puede exceder 150 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    minlength: [10, 'El contenido debe tener al menos 10 caracteres'],
    maxlength: [2000, 'El contenido no puede exceder 2000 caracteres']
  },
  
  // Calificación
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
    default: 5
  },
  
  // Producto relacionado (opcional)
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  
  // Estado y verificación
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Metadatos
  meta: {
    ip: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Índices para búsqueda y ordenamiento
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ status: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
