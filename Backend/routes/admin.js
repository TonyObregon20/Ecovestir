const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const adminCtrl = require('../controllers/adminController');

// Estadísticas del dashboard (productos activos, ventas pagadas, usuarios, ventas hoy)
router.get('/dashboard', protect, admin, adminCtrl.getDashboard);
// Estadísticas de órdenes para gráficos
router.get('/orders/stats', protect, admin, adminCtrl.getOrderStats);

module.exports = router;