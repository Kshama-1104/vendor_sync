const express = require('express');
const router = express.Router();
const consumerController = require('../controllers/consumer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Create consumer group
router.post('/', consumerController.create);

// Get consumer group
router.get('/:name', consumerController.get);

// List consumer groups
router.get('/', consumerController.list);

// Commit offset
router.post('/:name/offsets', consumerController.commitOffset);

// Get offsets
router.get('/:name/offsets', consumerController.getOffsets);

module.exports = router;


