const Category = require('../models/Category');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Crear categoría
exports.createCategory = async (req, res, next) => {
	try {
		const cat = await Category.create(req.body);
		return res.status(201).json(cat);
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ message: 'Nombre de categoría ya existe', keyValue: err.keyValue });
		}
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({ message: 'Validation error', errors: err.errors });
		}
		return next(err);
	}
};

// Listar categorías con paginación, búsqueda por q y filtrado por isActive
exports.getCategories = async (req, res, next) => {
	try {
		let { page = 1, limit = 12, q, isActive, sort = 'position' } = req.query;
		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 12;

		const filter = {};
		if (q) {
			filter.$or = [
				{ name: { $regex: q, $options: 'i' } },
				{ description: { $regex: q, $options: 'i' } }
			];
		}
		if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true' || isActive === '1';

				 const total = await Category.countDocuments(filter);
				 const categoriesRaw = await Category.find(filter)
						 .sort(sort)
						 .skip((page - 1) * limit)
						 .limit(limit);
				 // Count products per category
				 const categories = await Promise.all(
					 categoriesRaw.map(async (cat) => {
						 const productsCount = await Product.countDocuments({ category: cat._id });
						 const obj = cat.toObject();
						 obj.productsCount = productsCount;
						 return obj;
					 })
				 );
				 return res.json({
						 data: categories,
						 meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
				 });
	} catch (err) {
		return next(err);
	}
};

// Obtener una categoría por id
exports.getCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: 'ID inválido' });

		const cat = await Category.findById(id);
		if (!cat) return res.status(404).json({ message: 'No encontrado' });

		return res.json(cat);
	} catch (err) {
		return next(err);
	}
};

// Actualizar categoría
exports.updateCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: 'ID inválido' });

		const cat = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' });
		if (!cat) return res.status(404).json({ message: 'No encontrado' });
		return res.json(cat);
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ message: 'Nombre de categoría ya existe', keyValue: err.keyValue });
		}
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({ message: 'Validation error', errors: err.errors });
		}
		return next(err);
	}
};

// Eliminar categoría
exports.deleteCategory = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: 'ID inválido' });

		const deleted = await Category.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ message: 'No encontrado' });

		return res.json({ message: 'Categoría eliminada' });
	} catch (err) {
		return next(err);
	}
};
