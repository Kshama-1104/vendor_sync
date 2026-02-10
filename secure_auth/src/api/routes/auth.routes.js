const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const rateLimitMiddleware = require('../middlewares/rate-limit.middleware');

// Register
router.post('/register', rateLimitMiddleware.register, authValidator.register, authController.register);

// Login
router.post('/login', rateLimitMiddleware.login, authValidator.login, authController.login);

// Logout
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh', authValidator.refresh, authController.refresh);

// Password reset request
router.post('/password/reset', rateLimitMiddleware.passwordReset, authValidator.passwordResetRequest, authController.passwordResetRequest);

// Password reset confirm
router.post('/password/reset/confirm', rateLimitMiddleware.passwordReset, authValidator.passwordResetConfirm, authController.passwordResetConfirm);

// MFA setup
router.post('/mfa/setup', authController.mfaSetup);

// MFA verify
router.post('/mfa/verify', rateLimitMiddleware.mfa, authValidator.mfaVerify, authController.mfaVerify);

// OAuth routes
router.get('/oauth/:provider', authController.oauthInitiate);
router.get('/oauth/:provider/callback', authController.oauthCallback);

module.exports = router;


