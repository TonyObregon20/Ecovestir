const Product = require('../models/Product');
const mongoose = require('mongoose');

// Crear producto
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, material, sizeStock, ecoFriendly, isActive, images, rating, reviews } = req.body;
    
    // Verificar campos obligatorios
    if (!name || !price || !category || !material) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: name, price, category, material' 
      });
    }

    // No permitimos crear productos sin especificar stock por talla
    if (!sizeStock || sizeStock.length === 0) {
      return res.status(400).json({ 
        message: 'Debes especificar al menos una talla con stock' 
      });
    }
    
    const totalStock = sizeStock.reduce((sum, item) => sum + item.stock, 0); // Sumar el stock de todas las tallas para el campo legacy
    const sizes = sizeStock.map(item => item.size); // Obtener array de tallas para el campo legacy sizes

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      material,
      sizeStock, // Campo principal del nuevo sistema
      stock: totalStock, // Campo legacy calculado
      sizes, // Campo legacy calculado
      ecoFriendly: ecoFriendly !== undefined ? ecoFriendly : true,
      isActive: isActive !== undefined ? isActive : true,
      images: images || [],
      rating: rating || 0,
      reviews: reviews || 0
    });
    
    // El middleware pre-save se ejecutará automáticamente
    const savedProduct = await newProduct.save(); 
  
    // Obtener el producto con la categoría poblada (nombre completo)
    const populated = await Product.findById(savedProduct._id).populate('category', 'name description');
    
    return res.status(201).json(populated);
  } catch (err) {
    // Código 11000 = nombre duplicado (unique constraint)
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
    
    // Filtrop: búsqueda por texto en nombre o descripción
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filtro: por categoría (convertir string a ObjectId)
    if (category) {
      try {
        filter.category = new mongoose.Types.ObjectId(category);
      } catch (err) {
        return res.status(400).json({ message: 'ID de categoría inválido' });
      }
    }

    // Total de productos que coinciden con los filtros
    const total = await Product.countDocuments(filter);
    
    // Obtener productos con paginación
    const products = await Product.find(filter)
      .populate('category', 'name description')  // Incluir info de categoría
      .sort(sort)                                // Ordenar (por defecto: más recientes primero)
      .skip((page - 1) * limit)                  // Saltar productos de páginas anteriores
      .limit(limit)                              // Limitar cantidad de resultados
      .lean();                                   // Convertir a objetos JS planos (mejor rendimiento)
    
    // Agregar totalStock y availableSizes a cada producto, se calculan dinámicamente para el front
    const productsWithTotal = products.map(p => ({
      ...p,
      // Calcular stock total sumando todas las tallas
      totalStock: p.sizeStock && p.sizeStock.length > 0 
        ? p.sizeStock.reduce((sum, item) => sum + item.stock, 0)
        : 0,
      // Obtener tallas que tienen stock disponible
      availableSizes: p.sizeStock 
        ? p.sizeStock.filter(s => s.stock > 0).map(s => s.size)
        : []
    }));

    // Respuesta: datos + metadata de paginación
    return res.json({
      data: productsWithTotal,
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
    
    if (!mongoose.Types.ObjectId.isValid(id))  // Verificar que el ID sea válido
      return res.status(400).json({ message: 'ID inválido' });

    // Buscar producto y poblar categoría
    const prod = await Product.findById(id)
      .populate('category', 'name description')
      .lean(); // Convertir a objeto JS plano
    
    if (!prod) return res.status(404).json({ message: 'No encontrado' });
    
    // Agregar totalStock sumando todas las tallas
    prod.totalStock = prod.sizeStock && prod.sizeStock.length > 0 
      ? prod.sizeStock.reduce((sum, item) => sum + item.stock, 0)
      : 0;
    
    // Obtener solo tallas con stock disponible
    prod.availableSizes = prod.sizeStock 
      ? prod.sizeStock.filter(s => s.stock > 0).map(s => s.size)
      : [];

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

    const updateData = { ...req.body }; // Copiar datos del body
    
    // Si se actualiza sizeStock, recalcular campos legacy, mantiene sincronizados stock y sizes con sizeStock
    if (updateData.sizeStock && updateData.sizeStock.length > 0) {
      updateData.stock = updateData.sizeStock.reduce((sum, item) => sum + item.stock, 0); // Calcular stock total sumando cada talla
      updateData.sizes = updateData.sizeStock.map(item => item.size); // Extraer array de tallas disponibles
    }

    // Ejecutar update con validación
    const prod = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,           // Retornar documento actualizado
        runValidators: true, // Ejecutar validadores del schema
        context: 'query'     // Contexto para validators
      }
    ).populate('category', 'name description');

    if (!prod) return res.status(404).json({ message: 'No encontrado' }); 
    return res.json(prod);
  } catch (err) {
    // Código 11000 = nombre duplicado (unique constraint)
    if (err && err.code === 11000) {
      return res.status(409).json({ 
        message: 'Nombre de producto ya existe', 
        keyValue: err.keyValue 
      });
    }
    
    // Errores de validación del schema
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      });
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

// Verificar disponibilidad de stock para una talla específica, se usa antes de agregar productos al carrito
exports.verificarStockTalla = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { size, quantity } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID inválido' });
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const sizeData = product.sizeStock.find(s => s.size === size);  // Encontrar el stock de la talla solicitada
    if (!sizeData) {
      return res.status(404).json({ message: 'Talla no disponible' });
    }
  
    // Comparar stock disponible vs cantidad solicitada
    const available = sizeData.stock >= parseInt(quantity);
    // Informacion del stock
    return res.json({ 
      available,                              // ¿Hay suficiente stock?
      currentStock: sizeData.stock,           // Stock actual
      requestedQuantity: parseInt(quantity),  // Cantidad solicitada
      size                                    // Talla consultada
    });
  } catch (err) {
    return next(err);
  }
};

// Reducir stock de una talla específica (para órdenes), cuando se completa una orden de compra
exports.reducirStockTalla = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { size, quantity } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID inválido' });
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Encontrar el índice de la talla en el array sizeStock
    const sizeIndex = product.sizeStock.findIndex(s => s.size === size);
    if (sizeIndex === -1) {
      return res.status(404).json({ message: 'Talla no encontrada' });
    }
    
    // Verificar que hay suficiente stock antes de reducir
    if (product.sizeStock[sizeIndex].stock < quantity) {
      return res.status(400).json({ 
        message: 'Stock insuficiente',
        available: product.sizeStock[sizeIndex].stock,
        requested: quantity
      });
    }
    
    // Restar la cantidad comprada del stock de esta talla
    product.sizeStock[sizeIndex].stock -= quantity;
    
    // Persistir cambios en la BD, el middleware pre-save actualizará automáticamente stock y sizes
    await product.save();
    // Confirmación con el producto actualizado
    return res.json({
      message: 'Stock actualizado',
      product,
      totalStock: product.sizeStock.reduce((sum, item) => sum + item.stock, 0)
    });
  } catch (err) {
    return next(err);
  }
};


// 🔍 Buscar producto por nombre (para Voiceflow o buscadores)
exports.searchProductByName = async (req, res) => {
  try {
    const nombre = req.params.nombre?.trim();
    console.log('🔍 Buscando producto con nombre:', nombre);

    const producto = await Product.findOne({ name: { $regex: nombre, $options: 'i' } });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Calcular stock total (sumando todas las tallas)
    const totalStock = producto.sizeStock && producto.sizeStock.length > 0
      ? producto.sizeStock.reduce((sum, item) => sum + item.stock, 0)
      : 0;

    // Crear texto limpio y bien formateado
    const precioFormateado = `S/ ${Number(producto.price).toFixed(2)}`;
    const tallasDisponibles = producto.sizes && producto.sizes.length > 0
      ? producto.sizes.join(', ')
      : 'No disponible';

    // ✅ Respuesta ideal para Voiceflow
    const mensaje = `Tenemos la ${producto.name} a ${precioFormateado}. Tallas disponibles: ${tallasDisponibles}. Stock disponible: ${totalStock} unidades.`;

    res.json({
      nombre: producto.name,
      precio: precioFormateado,
      talla: tallasDisponibles,
      stock: totalStock,
      mensaje
    });
  } catch (error) {
    console.error('❌ Error al buscar producto:', error);
    res.status(500).json({ message: 'Error al buscar el producto' });
  }
};


