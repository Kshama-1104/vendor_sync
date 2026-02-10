const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rate-limit.middleware');

// Register
router.post('/register', authLimiter, authController.register);

// Login
router.post('/login', authLimiter, authController.login);

// Refresh token
router.post('/refresh', authController.refreshToken);

// OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);

module.exports = router;


