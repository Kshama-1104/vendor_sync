const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get dashboard
router.get('/dashboard', analyticsController.getDashboard);

// Get task analytics
router.get('/tasks', analyticsController.getTaskAnalytics);

// Get user performance
router.get('/users/:userId', analyticsController.getUserPerformance);

// Get workspace analytics
router.get('/workspaces/:workspaceId', analyticsController.getWorkspaceAnalytics);

// Export report
router.get('/export', analyticsController.exportReport);

module.exports = router;


