const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // 👈 asegúrate que el path es correcto
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    // Buscar o crear categorías
    let camisetasCategory = await Category.findOne({ name: 'Camisetas' });
    if (!camisetasCategory) {
      camisetasCategory = await Category.create({ name: 'Camisetas', description: 'Camisetas ecológicas' });
    }

    let pantalonesCategory = await Category.findOne({ name: 'Pantalones' });
    if (!pantalonesCategory) {
      pantalonesCategory = await Category.create({ name: 'Pantalones', description: 'Pantalones sostenibles' });
    }

    let chaquetasCategory = await Category.findOne({ name: 'Chaquetas' });
    if (!chaquetasCategory) {
      chaquetasCategory = await Category.create({ name: 'Chaquetas', description: 'Chaquetas eco-friendly' });
    }

    // NO eliminar productos existentes - solo agregar nuevos
    // await Product.deleteMany(); // COMENTADO para mantener productos existentes

    // Inserta productos de ejemplo con materiales y tallas
    const products = [
      {
        name: 'Camiseta Básica Orgánica',
        description: 'Camiseta 100% algodón orgánico certificado. Suave, cómoda y respetuosa con el medio ambiente.',
        price: 49.90,
        stock: 20,
        category: camisetasCategory._id,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        material: 'Algodón Orgánico',
        ecoFriendly: true,
        rating: 4.5,
        reviews: 12
      },
      {
        name: 'Camiseta Premium Bambú',
        description: 'Camiseta fabricada con fibra de bambú. Antibacteriana, transpirable y ultra suave.',
        price: 59.90,
        stock: 15,
        category: camisetasCategory._id,
        sizes: ['S', 'M', 'L'],
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400'],
        material: 'Bambú',
        ecoFriendly: true,
        rating: 4.8,
        reviews: 8
      },
      {
        name: 'Pantalón Jean Sostenible',
        description: 'Jean azul clásico hecho con algodón orgánico y proceso de teñido ecológico.',
        price: 89.90,
        stock: 15,
        category: pantalonesCategory._id,
        sizes: ['M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
        material: 'Algodón Orgánico',
        ecoFriendly: true,
        rating: 4.2,
        reviews: 25
      },
      {
        name: 'Pantalón Lino Natural',
        description: 'Pantalón fresco y ligero de lino 100% natural. Perfecto para el verano.',
        price: 79.90,
        stock: 12,
        category: pantalonesCategory._id,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'],
        material: 'Lino Natural',
        ecoFriendly: true,
        rating: 4.6,
        reviews: 15
      },
      {
        name: 'Chaqueta Deportiva Eco',
        description: 'Chaqueta ligera para entrenar, hecha con poliéster reciclado de botellas plásticas.',
        price: 120.00,
        stock: 10,
        category: chaquetasCategory._id,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
        material: 'Poliéster Reciclado',
        ecoFriendly: true,
        rating: 4.7,
        reviews: 18
      },
      {
        name: 'Chaqueta Cáñamo Premium',
        description: 'Chaqueta resistente fabricada con fibra de cáñamo orgánico. Durable y ecológica.',
        price: 145.00,
        stock: 8,
        category: chaquetasCategory._id,
        sizes: ['M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'],
        material: 'Cáñamo',
        ecoFriendly: true,
        rating: 4.9,
        reviews: 6
      },
      {
        name: 'Camiseta Tencel Suave',
        description: 'Camiseta de Tencel (lyocell) extraído de eucalipto sostenible. Sedosa y fresca.',
        price: 54.90,
        stock: 18,
        category: camisetasCategory._id,
        sizes: ['S', 'M', 'L'],
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'],
        material: 'Tencel',
        ecoFriendly: true,
        rating: 4.4,
        reviews: 10
      },
      {
        name: 'Pantalón Modal Confort',
        description: 'Pantalón casual de modal, fabricado de pulpa de madera de árboles sostenibles.',
        price: 69.90,
        stock: 14,
        category: pantalonesCategory._id,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'],
        material: 'Modal',
        ecoFriendly: true,
        rating: 4.3,
        reviews: 9
      }
    ];

    // Solo insertar productos que no existan (verificar por nombre)
    for (const productData of products) {
      const exists = await Product.findOne({ name: productData.name });
      if (!exists) {
        await Product.create(productData);
        console.log(`✅ Producto creado: ${productData.name}`);
      } else {
        console.log(`⏭️  Producto ya existe: ${productData.name}`);
      }
    }

    const totalProducts = await Product.countDocuments();
    console.log('✅ Proceso completado');
    console.log(`📦 Total de productos en DB: ${totalProducts}`);
    console.log('🧵 Materiales: Algodón Orgánico, Bambú, Lino Natural, Poliéster Reciclado, Cáñamo, Tencel, Modal');
    process.exit();
  } catch (err) {
    console.error('❌ Error al insertar productos:', err);
    process.exit(1);
  }
};

seedProducts();
