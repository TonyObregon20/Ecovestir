const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Endpoints públicos para consulta
router.get('/', productCtrl.getProducts);
router.get('/:id', productCtrl.getProduct);

// Verificar stock de una talla (público)
router.get('/:id/stock/:size', productCtrl.verificarStockTalla);

// Rutas protegidas para admins
router.post('/', protect, admin, productCtrl.createProduct);
router.put('/:id', protect, admin, productCtrl.updateProduct);
router.delete('/:id', protect, admin, productCtrl.deleteProduct);

// Reducir stock (usado por órdenes - requiere autenticación)
router.post('/:id/reduce-stock', protect, productCtrl.reducirStockTalla);

module.exports = router;
