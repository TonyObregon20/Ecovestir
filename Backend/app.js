const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

// Conexión a DB (no detener app si falla)
connectDB().catch(err => {
  console.error("❌ Error conectando a MongoDB:", err.message);
});

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const contactRoutes = require('./routes/contact');
const reviewRoutes = require('./routes/reviews');

const app = express();

// 🔐 Seguridad
app.disable("x-powered-by");
app.use(helmet());

// 📜 Logs
app.use(morgan('dev'));

// 📝 JSON
app.use(express.json());

// 🌐 CORS (ahora con whitelist)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,  // tu frontend de Netlify
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 📌 Rutas API
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// 🛑 Middleware de errores
app.use(errorHandler);

module.exports = app;
