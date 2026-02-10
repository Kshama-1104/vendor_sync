const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topic.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permissionMiddleware = require('../middlewares/permission.middleware');

// All routes require authentication
router.use(authMiddleware);

// Create topic
router.post('/', permissionMiddleware('manage:topics'), topicController.create);

// Get topic
router.get('/:name', topicController.get);

// List topics
router.get('/', topicController.list);

// Update topic
router.put('/:name', permissionMiddleware('manage:topics'), topicController.update);

// Delete topic
router.delete('/:name', permissionMiddleware('manage:topics'), topicController.delete);

module.exports = router;


