const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flow.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get all flows
router.get('/', flowController.getAll);

// Get flow by ID
router.get('/:id', flowController.getById);

// Create flow
router.post('/', roleMiddleware(['admin', 'flowManager']), flowController.create);

// Update flow
router.put('/:id', roleMiddleware(['admin', 'flowManager']), flowController.update);

// Delete flow
router.delete('/:id', roleMiddleware(['admin', 'flowManager']), flowController.delete);

// Execute flow
router.post('/:id/execute', roleMiddleware(['admin', 'flowManager', 'operator']), flowController.execute);

// Get flow execution history
router.get('/:id/executions', flowController.getExecutions);

// Get flow versions
router.get('/:id/versions', flowController.getVersions);

module.exports = router;


