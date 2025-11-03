const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

/*
  Crear una orden:    
   - validar carrito, 
   - decrementar stock por item (teniendo en cuenta la talla)
   - crear orden
   - limpiar carrito en una transacción
*/
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    session.startTransaction(); 

    // Cargar usuario con carrito (populate para detalles del producto como precio/nombre)
    const user = await User.findById(userId).populate('cart.productId').session(session);
    if (!user) throw new Error('Usuario no encontrado');
    if (!user.cart || user.cart.length === 0) return res.status(400).json({ message: 'Carrito vacío' });

    const orderItems = [];
    let total = 0;

    // Por cada ítem del carrito, validar stock y decrementar de forma atómica
    for (const item of user.cart) {
      const prodRef = item.productId;
      // si está poblado, prodRef es documento; si no, es un id - manejar ambos
      const prodId = prodRef && prodRef._id ? prodRef._id : prodRef;
      const product = await Product.findById(prodId).session(session);
      if (!product) throw new Error(`Producto no encontrado: ${prodId}`);
      const qty = item.quantity || 1;
      const size = item.size || '';

      // Si el producto tiene sizeStock, decrementar la entrada de la talla correspondiente
      if (product.sizeStock && product.sizeStock.length > 0) {
        // Usar actualización posicional $ para decrementar el stock de la talla específica de forma atómica
        const updateRes = await Product.updateOne(
          { _id: product._id, 'sizeStock.size': size, 'sizeStock.stock': { $gte: qty } },
          { $inc: { 'sizeStock.$.stock': -qty } }
        ).session(session);
        if (!updateRes || updateRes.modifiedCount === 0) {
          throw new Error(`Stock insuficiente para ${product.name} talla ${size}`);
        }
      } else {
        // Stock heredado
        const updateRes = await Product.updateOne(
          { _id: product._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } }
        ).session(session);
        if (!updateRes || updateRes.modifiedCount === 0) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }
      }

      orderItems.push({ productId: product._id, name: product.name, price: product.price, quantity: qty, size });
      total += (product.price || 0) * qty;
    }

    const order = await Order.create([{ userId, items: orderItems, total, status: 'paid', paymentInfo: req.body.paymentInfo || {} }], { session });
    user.cart = []; // Limpiar carrito del usuario
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    return res.json({ ok: true, order: order[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error createOrder:', error && error.stack ? error.stack : error);
    return res.status(400).json({ message: error.message || 'Error creando orden' });
  }
};

// Listar órdenes del usuario (populate para ver datos del producto en cada ítem)
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    return res.json(orders);
  } catch (err) {
    console.error('Error listOrders:', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Error al listar órdenes' });
  }
};
