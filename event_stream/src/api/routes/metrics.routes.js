const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get all metrics (root endpoint)
router.get('/', metricsController.getAllMetrics);

// Get all topics metrics
router.get('/topics', metricsController.getAllTopicsMetrics);

// Get topic metrics
router.get('/topics/:topicName', metricsController.getTopicMetrics);

// Get consumer metrics
router.get('/consumers/:consumerGroup', metricsController.getConsumerMetrics);

// Get system metrics
router.get('/system', metricsController.getSystemMetrics);

module.exports = router;


