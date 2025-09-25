const mongoose = require('mongoose');

// Order: almacena snapshot de precio por ítem para evitar cambios si el producto se actualiza luego.
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number // precio al momento de la compra
    }
  ],
  total: Number,
  // status útil para flujo de órdenes (pending -> paid -> shipped -> delivered)
  status: { type: String, enum: ['pending','paid','shipped','delivered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
