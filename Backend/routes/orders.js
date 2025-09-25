const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, orderCtrl.createOrder);
router.get('/', auth, orderCtrl.listOrders);

module.exports = router;
