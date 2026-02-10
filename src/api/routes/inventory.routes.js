const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get inventory
router.get(
  '/',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  inventoryController.getAll
);

// Get inventory by product ID
router.get(
  '/product/:productId',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  inventoryController.getByProduct
);

// Sync inventory
router.post(
  '/sync',
  roleMiddleware(['admin', 'operator', 'vendor']),
  inventoryController.sync
);

// Update inventory
router.put(
  '/:id',
  roleMiddleware(['admin', 'operator']),
  inventoryController.update
);

// Get inventory history
router.get(
  '/:id/history',
  roleMiddleware(['admin', 'user', 'operator']),
  inventoryController.getHistory
);

module.exports = router;


