const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware');

// Rutas del carrito: requieren autenticación
router.get('/', auth, cartCtrl.getCart);
router.post('/items', auth, cartCtrl.addItem);
router.delete('/items/:productId', auth, cartCtrl.removeItem);

module.exports = router;
