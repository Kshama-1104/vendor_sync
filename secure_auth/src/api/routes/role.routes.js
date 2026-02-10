const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissionMiddleware = require('../middlewares/permission.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get all roles
router.get('/', permissionMiddleware('read:roles'), roleController.getAll);

// Get role by ID
router.get('/:id', permissionMiddleware('read:roles'), roleController.getById);

// Create role
router.post('/', permissionMiddleware('create:roles'), roleController.create);

// Update role
router.put('/:id', permissionMiddleware('update:roles'), roleController.update);

// Delete role
router.delete('/:id', permissionMiddleware('delete:roles'), roleController.delete);

module.exports = router;


