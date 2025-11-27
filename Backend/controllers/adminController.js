const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Devuelve estadísticas simples para el panel de administración
exports.getDashboard = async (req, res, next) => {
  try {
    // Cantidad de productos activos
    const productosActivos = await Product.countDocuments({ isActive: true });

    // Cantidad de órdenes con status 'paid'
    const ventasPagadas = await Order.countDocuments({ status: 'paid' });

    // Total de usuarios
    const usuarios = await User.countDocuments();

    // Ventas de hoy (suma del campo total de órdenes pagadas creadas desde el inicio del día)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const ventasHoyAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, totalHoy: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    const ventasHoy = (ventasHoyAgg[0] && ventasHoyAgg[0].totalHoy) || 0;
    const ventasHoyCount = (ventasHoyAgg[0] && ventasHoyAgg[0].count) || 0;

    return res.json({
      productosActivos,
      ventasPagadas,
      usuarios,
      ventasHoy,
      ventasHoyCount
    });
  } catch (err) {
    return next(err);
  }
};

// Devuelve estadísticas de órdenes para gráficos
exports.getOrderStats = async (req, res, next) => {
  try {
    const now = new Date();
    // Meses: obtener desde hace 5 meses hasta mes actual (6 meses)
    const startSixMonths = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Aggregation: conteo y suma por mes
    const monthlyAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: startSixMonths } } },
      { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          total: { $sum: '$total' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Daily aggregation for current month
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const dailyAgg = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth } } },
      { $group: {
          _id: { day: { $dayOfMonth: '$createdAt' } },
          count: { $sum: 1 },
          total: { $sum: '$total' }
      }},
      { $sort: { '_id.day': 1 } }
    ]);

    // Normalizar salida: arrays con labels y values
    const monthly = monthlyAgg.map(m => ({ year: m._id.year, month: m._id.month, count: m.count, total: m.total }));
    const daily = dailyAgg.map(d => ({ day: d._id.day, count: d.count, total: d.total }));

    return res.json({ monthly, daily });
  } catch (err) {
    return next(err);
  }
};
