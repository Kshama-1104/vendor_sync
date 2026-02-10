const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get current user
router.get('/me', userController.getCurrentUser);

// Update profile
router.put('/me', userController.updateProfile);

// Get user by ID
router.get('/:id', roleMiddleware(['admin', 'manager']), userController.getById);

// Get all users
router.get('/', roleMiddleware(['admin', 'manager']), userController.getAll);

module.exports = router;


