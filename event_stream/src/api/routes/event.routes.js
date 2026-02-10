const express = require('express');
const router = express.Router({ mergeParams: true });
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissionMiddleware = require('../middlewares/permission.middleware');

// All routes require authentication
router.use(authMiddleware);

// Produce event
router.post('/', permissionMiddleware('produce:all'), eventController.produce);

// Produce batch
router.post('/batch', permissionMiddleware('produce:all'), eventController.produceBatch);

// Consume events
router.get('/', permissionMiddleware('consume:all'), eventController.consume);

module.exports = router;


