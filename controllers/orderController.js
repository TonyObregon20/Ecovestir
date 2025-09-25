const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear una orden a partir del carrito del usuario.
// 1) Trae el carrito y popula productos para obtener precio actual.
// 2) Calcula total y crea la orden.
// 3) Vacía el carrito.
exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
  const items = cart.items.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.product.price }));
  const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);
  const order = new Order({ user: req.user._id, items, total });
  await order.save();
  // Vaciar carrito tras crear la orden
  cart.items = [];
  await cart.save();
  res.status(201).json(order);
};

// Listar órdenes del usuario (populate para ver datos del producto en cada ítem)
exports.listOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};
