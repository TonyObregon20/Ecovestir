const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Conectado a MongoDB');
    
    const products = await Product.find({});
    console.log(`\n🔍 Encontrados ${products.length} productos para analizar\n`);
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const product of products) {
      try {
        // Si ya tiene sizeStock, saltar
        if (product.sizeStock && product.sizeStock.length > 0) {
          console.log(`⏭️  ${product.name} - Ya tiene sizeStock`);
          skipped++;
          continue;
        }
        
        // Si tiene stock pero no sizeStock
        if (product.stock > 0) {
          const sizes = product.sizes && product.sizes.length > 0 
            ? product.sizes 
            : ["M"]; // Talla por defecto
          
          const stockPorTalla = Math.floor(product.stock / sizes.length);
          const resto = product.stock % sizes.length;
          
          product.sizeStock = sizes.map((size, index) => ({
            size: size,
            stock: stockPorTalla + (index === 0 ? resto : 0)
          }));
          
          await product.save();
          
          console.log(`✅ ${product.name}`);
          console.log(`   Stock original: ${product.stock}`);
          console.log(`   Distribuido en: ${product.sizeStock.map(s => `${s.size}:${s.stock}`).join(', ')}`);
          migrated++;
        } else {
          console.log(`⚠️  ${product.name} - Sin stock para migrar`);
          skipped++;
        }
      } catch (err) {
        console.error(`❌ Error en ${product.name}:`, err.message);
        errors++;
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`   ✅ Migrados: ${migrated}`);
    console.log(`   ⏭️  Saltados: ${skipped}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📦 Total: ${products.length}`);
    console.log('='.repeat(60) + '\n');
    
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fatal:', err);
    process.exit(1);
  }
};

migrateProducts();
