const express = require('express');
const router = express.Router();
const reservationCtrl = require('../controllers/reservationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, reservationCtrl.reserve); 
router.delete('/', protect, reservationCtrl.release);
router.post('/confirm', protect, reservationCtrl.confirm);

module.exports = router;
