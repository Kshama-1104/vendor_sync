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

// Import broker for default queues
const inMemoryBroker = require('./core/broker/in-memory-broker');

// Import routes
const queueRoutes = require('./api/routes/queue.routes');
const messageRoutes = require('./api/routes/message.routes');
const workerRoutes = require('./api/routes/worker.routes');
const metricsRoutes = require('./api/routes/metrics.routes');

// Import middlewares
const errorMiddleware = require('./api/middlewares/error.middleware');

// Initialize default queues
async function initializeDefaultQueues() {
  const defaultQueues = [
    { name: 'default-queue', type: 'standard' },
    { name: 'priority-queue', type: 'priority' },
    { name: 'delay-queue', type: 'delay' },
    { name: 'dlq-queue', type: 'standard' }
  ];

  for (const queue of defaultQueues) {
    try {
      await inMemoryBroker.createQueue(queue.name, queue);
      logger.info(`Default queue initialized: ${queue.name}`);
    } catch (error) {
      logger.error(`Error initializing queue ${queue.name}:`, error.message);
    }
  }
}

// Initialize default queues on startup
initializeDefaultQueues();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  // Join queue room for real-time updates
  socket.on('join:queue', (queueName) => {
    socket.join(`queue:${queueName}`);
    logger.info(`Socket ${socket.id} joined queue ${queueName}`);
  });
});

// Make io available to routes
app.set('io', io);

// Security middleware - configure helmet to allow inline scripts for dashboard
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    queues: 0,
    workers: 0
  });
});

// API routes
app.use('/api/v1/queues', queueRoutes);
app.use('/api/v1/queues/:queueName/messages', messageRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/metrics', metricsRoutes);

// Root route - serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler for API routes
app.use((req, res) => {
  // If it's an API request, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  }
  // For non-API requests, serve the dashboard (SPA support)
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Export both app and httpServer for Socket.io
module.exports = { app, httpServer };
