const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const logger = require('./core/logger');

// Import routes
const flowRoutes = require('./api/routes/flow.routes');
const stateRoutes = require('./api/routes/state.routes');
const ruleRoutes = require('./api/routes/rule.routes');
const monitoringRoutes = require('./api/routes/monitoring.routes');

// Import middlewares
const errorMiddleware = require('./api/middlewares/error.middleware');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  // Join flow room for real-time updates
  socket.on('join:flow', (flowId) => {
    socket.join(`flow:${flowId}`);
    logger.info(`Socket ${socket.id} joined flow ${flowId}`);
  });

  // Join execution room
  socket.on('join:execution', (executionId) => {
    socket.join(`execution:${executionId}`);
    logger.info(`Socket ${socket.id} joined execution ${executionId}`);
  });
});

// Make io available to routes
app.set('io', io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

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
    uptime: process.uptime(),
    flows: 0,
    executions: 0
  });
});

// API routes
app.use('/api/v1/flows', flowRoutes);
app.use('/api/v1/flows/:flowId/states', stateRoutes);
app.use('/api/v1/flows/:flowId/rules', ruleRoutes);
app.use('/api/v1/monitoring', monitoringRoutes);

// 404 handler for API routes only
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API route not found'
    }
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Export both app and httpServer for Socket.io
module.exports = { app, httpServer };


