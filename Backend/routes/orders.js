const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const orderCtrl = require('../controllers/orderController');

router.post('/', protect, orderCtrl.createOrder);

module.exports = router;
