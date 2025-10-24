const Product = require('../models/Product');
const mongoose = require('mongoose');

// Crear producto
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Nombre de producto ya existe', keyValue: err.keyValue });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    return next(err);
  }
};

// Listado con paginación
exports.getProducts = async (req, res, next) => {
  try {
    let { page = 1, limit = 12, q, category, sort = '-createdAt' } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 12;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // 👇 CORREGIDO: Convierte el string a ObjectId para la categoría
    if (category) {
      try {
        filter.category = new mongoose.Types.ObjectId(category);
      } catch (err) {
        return res.status(400).json({ message: 'ID de categoría inválido' });
      }
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return next(err);
  }
};

// Obtener un producto por id
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID inválido' });

    const prod = await Product.findById(id);
    if (!prod) return res.status(404).json({ message: 'No encontrado' });

    return res.json(prod);
  } catch (err) {
    return next(err);
  }
};

// Actualizar producto
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID inválido' });

    const prod = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!prod) return res.status(404).json({ message: 'No encontrado' });
    return res.json(prod);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Nombre de producto ya existe', keyValue: err.keyValue });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    return next(err);
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID inválido' });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });

    return res.json({ message: 'Producto eliminado' });
  } catch (err) {
    return next(err);
  }
};