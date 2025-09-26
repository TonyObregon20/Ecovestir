const Product = require('../models/Product');
const mongoose = require('mongoose');

// Crear producto: se espera que el usuario esté autenticado y tenga rol admin (chequeo en routes).
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    // Manejo de duplicados (unique)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Nombre de producto ya existe', keyValue: err.keyValue });
    }
    // Errores de validación de Mongoose
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    return next(err);
  }
};

// Listado con paginación y búsqueda por nombre/description/categoría.
exports.getProducts = async (req, res, next) => {
  try {
    let { page = 1, limit = 12, q, category, sort = '-createdAt' } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 12;

    const filter = {};
    if (q) {
      // buscar en nombre o descripción
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({ data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return next(err);
  }
};

// Obtener un producto por id. Retorna 404 si no existe.
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID inválido' });
    const prod = await Product.findById(id);
    if (!prod) return res.status(404).json({ message: 'No encontrado' });
    return res.json(prod);
  } catch (err) {
    return next(err);
  }
};

// Actualizar producto; 'new: true' devuelve el documento actualizado y runValidators aplica validaciones del schema.
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID inválido' });
    const prod = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' });
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

// Eliminar producto (admin).
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID inválido' });
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    return res.json({ message: 'Producto eliminado' });
  } catch (err) {
    return next(err);
  }
};
