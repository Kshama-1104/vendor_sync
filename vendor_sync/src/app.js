const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const logger = require('./core/logger');

// Import routes
const vendorRoutes = require('./api/routes/vendor.routes');
const syncRoutes = require('./api/routes/sync.routes');
const inventoryRoutes = require('./api/routes/inventory.routes');
const orderRoutes = require('./api/routes/order.routes');
const analyticsRoutes = require('./api/routes/analytics.routes');

// Import middlewares
const errorMiddleware = require('./api/middlewares/error.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes (for testing)
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo login - accepts any credentials
  const token = jwt.sign(
    {
      id: 1,
      email: email || 'admin@vendorsync.com',
      role: 'admin',
      name: 'Admin User'
    },
    authConfig.jwt.secret,
    { expiresIn: authConfig.jwt.expiresIn }
  );
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: 1,
        email: email || 'admin@vendorsync.com',
        role: 'admin',
        name: 'Admin User'
      }
    }
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;


