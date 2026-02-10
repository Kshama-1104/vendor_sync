const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const messageValidator = require('../validators/message.validator');

// All routes require authentication
router.use(authMiddleware);

// Send message
router.post('/', messageValidator.send, messageController.send);

// Send batch messages
router.post('/batch', messageValidator.sendBatch, messageController.sendBatch);

// Receive messages
router.get('/', messageController.receive);

// Delete message
router.delete('/:receiptHandle', messageController.delete);

// Change message visibility
router.post('/:receiptHandle/visibility', messageValidator.changeVisibility, messageController.changeVisibility);

// Get message attributes
router.get('/:receiptHandle/attributes', messageController.getAttributes);

module.exports = router;


