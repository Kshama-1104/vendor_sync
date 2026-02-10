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
const topicRoutes = require('./api/routes/topic.routes');
const eventRoutes = require('./api/routes/event.routes');
const consumerRoutes = require('./api/routes/consumer.routes');
const metricsRoutes = require('./api/routes/metrics.routes');

// Import middlewares
const errorMiddleware = require('./api/middlewares/error.middleware');

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

  // Join topic room for real-time updates
  socket.on('join:topic', (topicName) => {
    socket.join(`topic:${topicName}`);
    logger.info(`Socket ${socket.id} joined topic ${topicName}`);
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
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    topics: 0,
    events: 0
  });
});

// API routes
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/topics/:topicName/events', eventRoutes);
app.use('/api/v1/consumer-groups', consumerRoutes);
app.use('/api/v1/metrics', metricsRoutes);

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

// Export both app and httpServer for Socket.io
module.exports = { app, httpServer };


