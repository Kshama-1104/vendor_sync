const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoring.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get execution status
router.get('/executions/:executionId', monitoringController.getExecutionStatus);

// Get flow metrics
router.get('/metrics', monitoringController.getMetrics);

// Get flow visualization
router.get('/visualization/:flowId', monitoringController.getVisualization);

// Get performance metrics
router.get('/performance', monitoringController.getPerformance);

module.exports = router;


