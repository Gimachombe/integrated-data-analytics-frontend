// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const dataServicesRoutes = require('./routes/dataServices');
const businessRoutes = require('./routes/business');
const kraRoutes = require('./routes/kra');
const bookkeepingRoutes = require('./routes/bookkeeping');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');



const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data-services', dataServicesRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/kra', kraRoutes);
app.use('/api/bookkeeping', bookkeepingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Data Business Platform API',
    version: '1.0.0',
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Data Business Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      dataServices: '/api/data-services',
      business: '/api/business',
      kra: '/api/kra',
      bookkeeping: '/api/bookkeeping',
      payments: '/api/payments',
      users: '/api/users',
      admin: '/api/admin',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
