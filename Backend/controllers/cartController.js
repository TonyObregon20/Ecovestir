// controllers/cartController.js
const User = require('../models/User');
const Product = require('../models/Product');

// 👉 Obtener el carrito del usuario (con detalles del producto)
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price image'); // ajusta los campos que quieras

    res.json(user.cart || []);
  } catch (error) {
    console.error('Error en getCart:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// 👉 Añadir ítem al carrito
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validar producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const user = await User.findById(req.user._id);

    // Buscar si ya existe en el carrito
    const existingItem = user.cart.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price image');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('Error en addItem:', error);
    res.status(500).json({ message: 'Error al añadir al carrito' });
  }
};

// 👉 Eliminar ítem del carrito
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price image');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('Error en removeItem:', error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};