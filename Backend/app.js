const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

// ==========================
// 🔌 Conexión a base de datos
// ==========================
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

// ==========================
// 🔐 Seguridad
// ==========================
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// ==========================
// 📜 Logs
// ==========================
app.use(morgan("dev"));

// ==========================
// 📝 JSON
// ==========================
app.use(express.json());

// ==========================
// 🌐 CORS CONFIG
// ==========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecovestir-ztc7.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("❌ CORS bloqueado para:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Permitir preflight OPTIONS
app.options("*", cors());

// ==========================
// 📌 RUTAS API
// ==========================
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

// ==========================
// 🔚 RUTA 404 (Express 5 compatible)
// ==========================
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ==========================
// 🛑 MANEJADOR DE ERRORES
// ==========================
app.use(errorHandler);

module.exports = app;
