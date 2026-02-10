const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const vendorValidator = require('../validators/vendor.validator');

// All routes require authentication
router.use(authMiddleware);

// Get all vendors
router.get(
  '/',
  roleMiddleware(['admin', 'user', 'operator']),
  vendorController.getAll
);

// Get vendor by ID
router.get(
  '/:id',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  vendorController.getById
);

// Create vendor
router.post(
  '/',
  roleMiddleware(['admin']),
  vendorValidator.create,
  vendorController.create
);

// Update vendor
router.put(
  '/:id',
  roleMiddleware(['admin', 'vendor']),
  vendorValidator.update,
  vendorController.update
);

// Delete vendor
router.delete(
  '/:id',
  roleMiddleware(['admin']),
  vendorController.delete
);

// Get vendor products
router.get(
  '/:id/products',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  vendorController.getProducts
);

// Get vendor sync status
router.get(
  '/:id/sync-status',
  roleMiddleware(['admin', 'user', 'operator', 'vendor']),
  vendorController.getSyncStatus
);

module.exports = router;


