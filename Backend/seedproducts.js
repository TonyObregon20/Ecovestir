const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // 👈 asegúrate que el path es correcto
const connectDB = require('./config/db');

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    // Elimina productos anteriores (opcional)
    await Product.deleteMany();

    // Inserta productos de ejemplo
    const products = [
      {
        name: 'Camiseta básica',
        description: 'Camiseta 100% algodón',
        price: 49.90,
        stock: 20,
        category: 'camisetas',
        sizes: ['S', 'M', 'L'],
        images: ['https://via.placeholder.com/150']
      },
      {
        name: 'Pantalón jean',
        description: 'Jean azul clásico',
        price: 89.90,
        stock: 15,
        category: 'pantalones',
        sizes: ['M', 'L', 'XL'],
        images: ['https://via.placeholder.com/150']
      },
      {
        name: 'Casaca deportiva',
        description: 'Casaca ligera para entrenar',
        price: 120.00,
        stock: 10,
        category: 'camisetas',
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://via.placeholder.com/150']
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Productos insertados correctamente');
    process.exit();
  } catch (err) {
    console.error('❌ Error al insertar productos:', err);
    process.exit(1);
  }
};

seedProducts();
