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
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// error handler (último middleware)
app.use(errorHandler);

module.exports = app;
