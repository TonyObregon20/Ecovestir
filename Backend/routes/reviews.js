const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReview);
router.post('/', protect, reviewController.createReview);

// Rutas admin
router.get('/admin/all', protect, admin, reviewController.getAllReviewsAdmin);
router.put('/:id/status', protect, admin, reviewController.updateReviewStatus);
router.delete('/:id', protect, admin, reviewController.deleteReview);

module.exports = router;
