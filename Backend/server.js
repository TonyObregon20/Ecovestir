const app = require('./app');
// Puerto configurable vía env var, por defecto 5000
const PORT = process.env.PORT || 5000;

// Inicia el servidor. Mantener esta pequeña capa separada facilita tests (importar app sin escuchar).
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
