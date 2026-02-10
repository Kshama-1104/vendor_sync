const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userValidator = require('../validators/user.validator');

// All routes require authentication
router.use(authMiddleware);

// Get current user
router.get('/me', userController.getCurrentUser);

// Update current user
router.put('/me', userValidator.update, userController.updateCurrentUser);

// Change password
router.post('/me/password', userValidator.changePassword, userController.changePassword);

// Get user by ID (admin only)
router.get('/:id', userController.getById);

module.exports = router;


