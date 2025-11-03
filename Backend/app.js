const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

connectDB();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


// error handler (último middleware)
app.use(errorHandler);

module.exports = app;
