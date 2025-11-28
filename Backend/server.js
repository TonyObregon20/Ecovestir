require('dotenv').config(); // Carga variables de entorno

// Advertencia si falta JWT_SECRET (no detiene el servidor en producción)
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ ADVERTENCIA: La variable JWT_SECRET no está definida.');
}

// Si usas Mongoose, puedes conectar aquí
/*
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });
*/

const app = require('./app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
