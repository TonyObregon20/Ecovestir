// routes/admin.js
const express = require('express');
const router = express.Router();

// 👇 Importa tus middlewares desde la carpeta correcta
const { protect, admin } = require('../middlewares/authMiddleware');

// Ejemplo de ruta protegida
router.get('/dashboard', protect, admin, (req, res) => {
  res.json({
    message: 'Acceso concedido al panel de administración',
    user: req.user,
  });
});

// Puedes agregar más rutas aquí después
// Ejemplo:
// router.get('/products', protect, admin, productController.getAllProducts);

module.exports = router;