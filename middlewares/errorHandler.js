// Middleware global de manejo de errores. Debe ser el último middleware registrado.
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
};
