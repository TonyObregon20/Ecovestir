require('dotenv').config(); // Carga variables de entorno

// Advertencia si falta JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ ADVERTENCIA: La variable JWT_SECRET no está definida.');
}

const app = require('./app');
const PORT = process.env.PORT || 4000;

// ============================
// 📌 Ruta raíz opcional (Render health check)
// ============================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend Ecovestir funcionando correctamente 🚀",
    timestamp: new Date()
  });
});

// ============================
// 🚀 Iniciar servidor
// ============================
app.listen(PORT, () => {
  console.log(`
===========================================
🚀 Servidor Ecovestir activo
📌 Puerto: ${PORT}
🌍 Dominio público: ${process.env.RENDER_EXTERNAL_URL || "No disponible"}
===========================================
  `);
});
