const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Crear una reserva temporal (no modifica Product stock, solo registra reserva con expiración)
exports.reserve = async (req, res) => {
  try {
    const { productId, size = '', quantity = 1, ttlMinutes = 10 } = req.body;
    const userId = req.user._id;

    console.log('reserve called', { productId, size, quantity, ttlMinutes, userId });

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'productId inválido' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Calcular cantidad ya reservada (no expirada)
    const now = new Date();
    const reservedAgg = await Reservation.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), size: size, expiresAt: { $gt: now } } },
      { $group: { _id: null, qty: { $sum: '$quantity' } } }
    ]);
    const reservedQty = reservedAgg[0]?.qty || 0;

    // Disponibilidad real según sizeStock o legacy stock
    let available = 0;
    if (product.sizeStock && product.sizeStock.length > 0) {
      const sizeEntry = product.sizeStock.find(s => (s.size || '') === size);
      if (!sizeEntry) return res.status(400).json({ message: 'Talla inválida para este producto' });
      available = (sizeEntry.stock || 0) - reservedQty;
    } else {
      available = (product.stock || 0) - reservedQty;
    }

    if (available < quantity) {
      return res.status(400).json({ message: 'No hay stock suficiente para reservar' });
    }

    const expiresAt = new Date(Date.now() + (ttlMinutes || 10) * 60 * 1000);
    const reservation = await Reservation.create({ user: userId, productId, size, quantity, expiresAt });
    return res.json({ ok: true, reservation });
  } catch (error) {
    console.error('Error en reserve:', error && error.stack ? error.stack : error);
    return res.status(500).json({ message: error.message || 'Error al crear la reserva' });
  }
};

// Liberar reservas del usuario para un producto/talla
exports.release = async (req, res) => {
  try {
    const { productId, size = '' } = req.body;
    const userId = req.user._id;

    const filter = { user: userId };
    if (productId) filter.productId = productId;
    if (size) filter.size = size;

    await Reservation.deleteMany(filter);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Error en release:', error);
    return res.status(500).json({ message: 'Error al liberar reservas' });
  }
};

// Confirmar reservas del usuario: decrementar stock y borrar reservas en una transacción
exports.confirm = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    session.startTransaction();

    const reservations = await Reservation.find({ user: userId }).session(session);
    if (!reservations || reservations.length === 0) {
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: 'No hay reservas para confirmar' });
    }

    // Agrupar por productoId+size
    const grouped = {};
    for (const r of reservations) {
      const key = `${r.productId.toString()}::${r.size || ''}`;
      grouped[key] = (grouped[key] || 0) + r.quantity;
    }

    // Para cada grupo, decrementar stock atomically
    for (const key of Object.keys(grouped)) {
      const [productId, size] = key.split('::');
      const qty = grouped[key];
      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error('Producto no encontrado durante confirmación');

      if (product.sizeStock && product.sizeStock.length > 0) {
        const sizeIdx = product.sizeStock.findIndex(s => (s.size || '') === size);
        if (sizeIdx < 0) throw new Error('Talla inválida en confirmación');
        if ((product.sizeStock[sizeIdx].stock || 0) < qty) throw new Error('Stock insuficiente en confirmación');
        product.sizeStock[sizeIdx].stock = (product.sizeStock[sizeIdx].stock || 0) - qty;
        await product.save({ session });
      } else {
        if ((product.stock || 0) < qty) throw new Error('Stock insuficiente en confirmación');
        product.stock = (product.stock || 0) - qty;
        await product.save({ session });
      }
    }

    // Borrar reservas del usuario
    await Reservation.deleteMany({ user: userId }).session(session);

    await session.commitTransaction();
    session.endSession();
    return res.json({ ok: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error en confirm reservations:', error);
    return res.status(500).json({ message: error.message || 'Error al confirmar reservas' });
  }
};
