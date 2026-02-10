const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approval.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const approvalValidator = require('../validators/approval.validator');

// All routes require authentication
router.use(authMiddleware);

// Get pending approvals
router.get('/', approvalController.getPending);

// Get approval by ID
router.get('/:id', approvalController.getById);

// Approve request
router.post('/:id/approve', approvalValidator.approve, approvalController.approve);

// Reject request
router.post('/:id/reject', approvalValidator.reject, approvalController.reject);

// Get approval history
router.get('/:id/history', approvalController.getHistory);

module.exports = router;


