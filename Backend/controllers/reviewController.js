const Review = require('../models/Review');
const Product = require('../models/Product');

// Obtener todas las reseñas (públicas aprobadas)
exports.getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, rating, sortBy = '-createdAt' } = req.query;

    // Filtros
    const filter = { status: 'approved' };
    if (rating) filter.rating = Number(rating);

    // Consulta con paginación
    const reviews = await Review.find(filter)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('product', 'name images')
      .select('-email -meta'); // No exponer emails públicamente

    const total = await Review.countDocuments(filter);

    // Calcular estadísticas
    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 },
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (err) {
    next(err);
  }
};

// Crear nueva reseña
exports.createReview = async (req, res, next) => {
  try {
    const { author, email, title, content, rating, productId } = req.body;

    // Validaciones
    if (!author || !email || !title || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Datos de la reseña
    const reviewData = {
      author,
      email,
      title,
      content,
      rating,
      meta: {
        ip: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.get('User-Agent')
      }
    };

    // Si se especifica un producto, validar y obtener sus datos
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        reviewData.product = productId;
        reviewData.productName = product.name;
        reviewData.productImage = product.images?.[0] || '';
      }
    }

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      message: 'Reseña enviada exitosamente. Será publicada después de su revisión.',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// Obtener reseña por ID
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: Obtener todas las reseñas (incluyendo pendientes)
exports.getAllReviewsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('product', 'name');

    const total = await Review.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: Aprobar/Rechazar reseña
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status, verified } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, verified },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: `Reseña ${status === 'approved' ? 'aprobada' : 'rechazada'}`,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: Eliminar reseña
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña eliminada'
    });
  } catch (err) {
    next(err);
  }
};
