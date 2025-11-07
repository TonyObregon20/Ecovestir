const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: { type: String, trim: true, maxlength: 9, required: true },
  reason: {
    type: String,
    enum: ['Informacion del producto', 'Consulta sobre pedido', 'Devolucion/Cambio', 'Sostenibilidad', 'Ventas por mayor', 'Prensa/Media', 'Otro'],
    required: true
  },
  subject: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
