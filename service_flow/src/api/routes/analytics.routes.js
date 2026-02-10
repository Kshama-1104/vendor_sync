const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get dashboard
router.get('/dashboard', analyticsController.getDashboard);

// Get service analytics
router.get('/services', analyticsController.getServiceAnalytics);

// Get workflow analytics
router.get('/workflows', analyticsController.getWorkflowAnalytics);

// Get department performance
router.get('/departments', analyticsController.getDepartmentPerformance);

// Export report
router.get('/export', analyticsController.exportReport);

module.exports = router;


