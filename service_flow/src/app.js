const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./core/logger');

// Import routes
const serviceRoutes = require('./api/routes/service.routes');
const workflowRoutes = require('./api/routes/workflow.routes');
const approvalRoutes = require('./api/routes/approval.routes');
const slaRoutes = require('./api/routes/sla.routes');
const analyticsRoutes = require('./api/routes/analytics.routes');

// Import middlewares
const { errorHandler, notFoundHandler } = require('./api/middlewares/error.middleware');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  // Join service room
  socket.on('join:service', (serviceId) => {
    socket.join(`service:${serviceId}`);
    logger.info(`Socket ${socket.id} joined service ${serviceId}`);
  });

  // Leave service room
  socket.on('leave:service', (serviceId) => {
    socket.leave(`service:${serviceId}`);
    logger.info(`Socket ${socket.id} left service ${serviceId}`);
  });
});

// Make io available to routes
app.set('io', io);

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

// Auth endpoint for testing (generates a test token)
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');

app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Demo users for testing
  const demoUsers = {
    admin: { id: 1, username: 'admin', role: 'admin', name: 'Admin User' },
    manager: { id: 2, username: 'manager', role: 'manager', name: 'Manager User' },
    user: { id: 3, username: 'user', role: 'user', name: 'Regular User' }
  };

  const user = demoUsers[username];
  if (user && password === 'password123') {
    const token = jwt.sign(user, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiresIn });
    return res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      }
    });
  }

  res.status(401).json({
    success: false,
    error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }
  });
});

// Serve frontend static files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// Redirect root to frontend
app.get('/', (req, res) => {
  res.redirect('/frontend/index.html');
});

// API routes
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/approvals', approvalRoutes);
app.use('/api/v1/sla', slaRoutes);
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
app.use(errorHandler);

// Export both app and httpServer for Socket.io
module.exports = { app, httpServer };


