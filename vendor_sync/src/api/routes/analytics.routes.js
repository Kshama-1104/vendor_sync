const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get dashboard data
router.get(
  '/dashboard',
  roleMiddleware(['admin', 'user', 'operator']),
  analyticsController.getDashboard
);

// Get sync metrics
router.get(
  '/sync-metrics',
  roleMiddleware(['admin', 'user', 'operator']),
  analyticsController.getSyncMetrics
);

// Get vendor performance
router.get(
  '/vendor-performance/:vendorId',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  analyticsController.getVendorPerformance
);

// Get inventory analytics
router.get(
  '/inventory',
  roleMiddleware(['admin', 'user', 'operator']),
  analyticsController.getInventoryAnalytics
);

// Get order analytics
router.get(
  '/orders',
  roleMiddleware(['admin', 'user', 'operator']),
  analyticsController.getOrderAnalytics
);

// Export report
router.get(
  '/export',
  roleMiddleware(['admin', 'user']),
  analyticsController.exportReport
);

module.exports = router;


