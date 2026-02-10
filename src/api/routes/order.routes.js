const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const orderValidator = require('../validators/order.validator');

// All routes require authentication
router.use(authMiddleware);

// Get all orders
router.get(
  '/',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  orderController.getAll
);

// Get order by ID
router.get(
  '/:id',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  orderController.getById
);

// Create order
router.post(
  '/',
  roleMiddleware(['admin', 'operator']),
  orderValidator.create,
  orderController.create
);

// Update order
router.put(
  '/:id',
  roleMiddleware(['admin', 'operator', 'vendor']),
  orderValidator.update,
  orderController.update
);

// Update order status
router.patch(
  '/:id/status',
  roleMiddleware(['admin', 'operator', 'vendor']),
  orderController.updateStatus
);

// Sync orders
router.post(
  '/sync',
  roleMiddleware(['admin', 'operator', 'vendor']),
  orderController.sync
);

module.exports = router;


