const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtener el carrito del usuario. populate trae los detalles del producto.
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Añadir ítem: si ya existe en el carrito incrementa la cantidad.
exports.addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });
  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) existing.quantity += quantity; else cart.items.push({ product: productId, quantity });
  await cart.save();
  res.json(cart);
};

// Eliminar un ítem del carrito por productId.
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};
