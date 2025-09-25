const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect: middleware que valida el JWT enviado en Authorization: Bearer <token>
// Adjunta el usuario a req.user (sin contraseña) para que los controladores lo usen.
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // select('-password') evita exponer el hash de la contraseña.
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// admin: middleware simple para verificar rol de usuario. Asume que protect ya corrió.
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Requiere rol admin' });
};
