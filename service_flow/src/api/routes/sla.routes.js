const express = require('express');
const router = express.Router();
const slaController = require('../controllers/sla.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get SLA status
router.get('/status', slaController.getStatus);

// Get SLA violations
router.get('/violations', roleMiddleware(['admin', 'manager']), slaController.getViolations);

// Get SLA metrics
router.get('/metrics', roleMiddleware(['admin', 'manager']), slaController.getMetrics);

// Get SLA by service ID
router.get('/service/:serviceId', slaController.getByService);

module.exports = router;


