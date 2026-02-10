const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const syncValidator = require('../validators/sync.validator');

// All routes require authentication
router.use(authMiddleware);

// Get sync status
router.get(
  '/status',
  roleMiddleware(['admin', 'user', 'operator']),
  syncController.getStatus
);

// Trigger manual sync
router.post(
  '/trigger',
  roleMiddleware(['admin', 'operator']),
  syncValidator.trigger,
  syncController.trigger
);

// Get sync history
router.get(
  '/history',
  roleMiddleware(['admin', 'user', 'operator']),
  syncController.getHistory
);

// Get sync logs
router.get(
  '/logs/:syncId',
  roleMiddleware(['admin', 'user', 'operator']),
  syncController.getLogs
);

// Retry failed sync
router.post(
  '/retry/:syncId',
  roleMiddleware(['admin', 'operator']),
  syncController.retry
);

// Cancel sync
router.post(
  '/cancel/:syncId',
  roleMiddleware(['admin', 'operator']),
  syncController.cancel
);

module.exports = router;


