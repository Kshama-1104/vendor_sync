const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Register worker
router.post('/', workerController.register);

// Get worker status
router.get('/:id', workerController.getStatus);

// List workers
router.get('/', roleMiddleware(['admin', 'operator']), workerController.list);

// Update worker
router.put('/:id', workerController.update);

// Deregister worker
router.delete('/:id', workerController.deregister);

// Scale workers
router.post('/scale', roleMiddleware(['admin', 'operator']), workerController.scale);

module.exports = router;


