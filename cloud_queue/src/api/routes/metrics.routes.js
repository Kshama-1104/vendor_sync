const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get queue metrics
router.get('/queues/:queueName', roleMiddleware(['admin', 'operator']), metricsController.getQueueMetrics);

// Get worker metrics
router.get('/workers', roleMiddleware(['admin', 'operator']), metricsController.getWorkerMetrics);

// Get system metrics
router.get('/system', roleMiddleware(['admin', 'operator']), metricsController.getSystemMetrics);

// Get consumer lag
router.get('/lag/:queueName', roleMiddleware(['admin', 'operator']), metricsController.getConsumerLag);

module.exports = router;


