const Product = require('../models/Product');

// Crear producto: se espera que el usuario esté autenticado y tenga rol admin (chequeo en routes).
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
};

// Listado con paginación sencilla y búsqueda por nombre/categoría.
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, q, category } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' }; // búsqueda case-insensitive
    if (category) filter.category = category;
    const products = await Product.find(filter)
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(products);
  } catch (err) { next(err); }
};

// Obtener un producto por id. Retorna 404 si no existe.
exports.getProduct = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'No encontrado' });
    res.json(prod);
  } catch (err) { next(err); }
};

// Actualizar producto; 'new: true' devuelve el documento actualizado.
exports.updateProduct = async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prod);
  } catch (err) { next(err); }
};

// Eliminar producto (admin).
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
};
