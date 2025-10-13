// routes/cart.js
const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware'); // 👈 destructuring

// Rutas del carrito: requieren autenticación
router.get('/', protect, cartCtrl.getCart);
router.post('/items', protect, cartCtrl.addItem);
router.delete('/items/:productId', protect, cartCtrl.removeItem);

module.exports = router;