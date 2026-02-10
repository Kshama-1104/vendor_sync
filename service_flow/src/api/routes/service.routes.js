const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const serviceValidator = require('../validators/service.validator');

// All routes require authentication
router.use(authMiddleware);

// Get all services
router.get('/', serviceController.getAll);

// Get service by ID
router.get('/:id', serviceController.getById);

// Create service request
router.post('/', serviceValidator.create, serviceController.create);

// Update service
router.put('/:id', serviceValidator.update, serviceController.update);

// Update service status
router.patch('/:id/status', serviceController.updateStatus);

// Cancel service
router.post('/:id/cancel', serviceController.cancel);

// Pause service
router.post('/:id/pause', serviceController.pause);

// Resume service
router.post('/:id/resume', serviceController.resume);

// Get service history
router.get('/:id/history', serviceController.getHistory);

module.exports = router;


