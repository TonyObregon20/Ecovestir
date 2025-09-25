const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

connectDB();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
// TODO: cartRoutes, orderRoutes

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// // Lista de orígenes permitidos
// const allowedOrigins = [
//   "http://localhost:5173", // Vite
//   "http://localhost:3000"  // CRA o cualquier otro
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // permite requests sin origen (ej: Postman)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `La política CORS bloqueó este origen: ${origin}`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true, // si planeas enviar cookies o JWT en headers
//   })
// );

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// app.use(cors()); // <--- IMPORTANTE para permitir conexión desde React


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// error handler (último middleware)
app.use(errorHandler);

module.exports = app;
