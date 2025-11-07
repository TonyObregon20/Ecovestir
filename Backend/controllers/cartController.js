const User = require('../models/User');
const Product = require('../models/Product');

// Obtener el carrito del usuario (con detalles del producto)
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price images');

    res.json(user.cart || []);
  } catch (error) {
    console.error('Error en getCart:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Añadir ítem al carrito
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1, size = '' } = req.body;

    const product = await Product.findById(productId); // Validar producto
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const user = await User.findById(req.user._id);

    // Buscar si ya existe en el carrito (por productId + size)
    const existingItem = user.cart.find(     
      item => item.productId.toString() === productId && (item.size || '') === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price images');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('Error en addItem:', error);
    res.status(500).json({ message: 'Error al añadir al carrito' });
  }
};

// Eliminar ítem del carrito
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const size = req.query.size || '';
    const user = await User.findById(req.user._id);

    // Filtrar por productId y talla (si se pasó talla)
    user.cart = user.cart.filter(
      item => !(item.productId.toString() === productId && ((item.size || '') === size))
    );

    await user.save();
    const updatedUser = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price images');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('Error en removeItem:', error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Vaciar todo el carrito del usuario (restaurando stock por talla)
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Vaciar el arreglo del carrito y guardar (las reservas se manejan por separado)
    user.cart = [];
    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .select('cart')
      .populate('cart.productId', 'name price images');

    return res.json(updatedUser.cart || []);
  } catch (error) {
    console.error('Error en clearCart:', error);
    return res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};