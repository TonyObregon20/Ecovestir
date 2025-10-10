const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public: listar y obtener
router.get('/', categoryCtrl.getCategories);
router.get('/:id', categoryCtrl.getCategory);

// Protected (admin): crear, actualizar, eliminar
router.post('/', protect, admin, categoryCtrl.createCategory);
router.put('/:id', protect, admin, categoryCtrl.updateCategory);
router.delete('/:id', protect, admin, categoryCtrl.deleteCategory);

module.exports = router;
