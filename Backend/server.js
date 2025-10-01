// server.js
require('dotenv').config(); // ← Carga las variables de .env al inicio

// Validación crítica: asegurar que JWT_SECRET esté definido
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: La variable JWT_SECRET no está definida en el archivo .env');
  console.error('   Por favor, agrega una línea como esta en tu .env:');
  console.error('   JWT_SECRET=tu_clave_secreta_aleatoria_aqui');
  process.exit(1); // Detiene el servidor si falta la clave
}

// Opcional: si usas Mongoose, puedes conectar aquí o en ./app
/*
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });
*/

const app = require('./app'); // Tu aplicación Express

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔐 JWT_SECRET cargado: ${process.env.JWT_SECRET ? 'Sí' : 'No'} (¡debe decir "Sí"!)`);
});