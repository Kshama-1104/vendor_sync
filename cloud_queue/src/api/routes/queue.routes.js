const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const queueValidator = require('../validators/queue.validator');

// All routes require authentication
router.use(authMiddleware);

// Create queue
router.post('/', roleMiddleware(['admin', 'operator']), queueValidator.create, queueController.create);

// Get queue
router.get('/:name', queueController.get);

// List queues
router.get('/', queueController.list);

// Update queue
router.put('/:name', roleMiddleware(['admin', 'operator']), queueValidator.update, queueController.update);

// Delete queue
router.delete('/:name', roleMiddleware(['admin', 'operator']), queueController.delete);

// Purge queue
router.post('/:name/purge', roleMiddleware(['admin', 'operator']), queueController.purge);

// Pause queue
router.post('/:name/pause', roleMiddleware(['admin', 'operator']), queueController.pause);

// Resume queue
router.post('/:name/resume', roleMiddleware(['admin', 'operator']), queueController.resume);

// Get queue attributes
router.get('/:name/attributes', queueController.getAttributes);

module.exports = router;


