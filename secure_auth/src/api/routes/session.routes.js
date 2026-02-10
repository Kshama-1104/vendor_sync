const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get active sessions
router.get('/', sessionController.getActiveSessions);

// Get session by ID
router.get('/:id', sessionController.getById);

// Revoke session
router.delete('/:id', sessionController.revoke);

// Revoke all sessions
router.delete('/', sessionController.revokeAll);

module.exports = router;


