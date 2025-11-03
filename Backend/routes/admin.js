const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, admin, (req, res) => {
  res.json({
    message: 'Acceso concedido al panel de administración',
    user: req.user,
  });
});

module.exports = router;