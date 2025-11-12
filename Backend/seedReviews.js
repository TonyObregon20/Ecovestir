// Script para crear reseñas de ejemplo
const mongoose = require('mongoose');
const Review = require('./models/Review');
require('dotenv').config();

const seedReviews = [
  {
    author: 'María García',
    email: 'maria@example.com',
    title: 'La mejor compra que he hecho',
    content: 'Compré varias camisetas de algodón orgánico y la calidad es excepcional. Son súper suaves y me encanta saber que son sostenibles. El proceso de compra fue muy fácil y el envío llegó antes de lo esperado. ¡Definitivamente volveré a comprar!',
    rating: 5,
    productName: 'Camiseta de Algodón Orgánico Premium',
    productImage: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    status: 'approved'
  },
  {
    author: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    title: 'Excelente calidad y servicio',
    content: 'Me impresionó la atención al cliente. Tenía algunas dudas sobre las tallas y me respondieron muy rápido. El vestido de bambú que compré para mi esposa le quedó perfecto y es hermoso. La tela es increíblemente suave.',
    rating: 5,
    productName: 'Vestido de Bambú Sostenible',
    productImage: 'https://images.unsplash.com/photo-1643185720431-9c050eebbc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhbWJvbyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzU1MDMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    status: 'approved'
  },
  {
    author: 'Ana Martínez',
    email: 'ana@example.com',
    title: 'Ropa cómoda y consciente',
    content: 'Llevo años buscando ropa sostenible de calidad y finalmente encontré EcoVestir. Los pantalones de cáñamo son perfectos para el día a día. Son cómodos, duraderos y el color se mantiene después de varios lavados.',
    rating: 4,
    productName: 'Pantalón de Cáñamo Ecológico',
    productImage: 'https://images.unsplash.com/photo-1543121032-68865adeff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGhlbXAlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTc1NTAzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    status: 'approved'
  }
];

async function seed() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar reseñas existentes (opcional)
    await Review.deleteMany({});
    console.log('🗑️  Reseñas anteriores eliminadas');

    // Insertar reseñas de ejemplo
    const reviews = await Review.insertMany(seedReviews);
    console.log(`✅ ${reviews.length} reseñas creadas exitosamente`);

    // Mostrar estadísticas
    const stats = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Estadísticas:');
    console.log(`   Total de reseñas: ${stats[0].totalReviews}`);
    console.log(`   Calificación promedio: ${stats[0].averageRating.toFixed(1)}⭐`);

    mongoose.connection.close();
    console.log('\n✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seed();
