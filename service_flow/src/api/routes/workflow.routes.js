const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflow.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const workflowValidator = require('../validators/workflow.validator');

// All routes require authentication
router.use(authMiddleware);

// Get all workflows
router.get('/', workflowController.getAll);

// Get workflow by ID
router.get('/:id', workflowController.getById);

// Create workflow
router.post('/', roleMiddleware(['admin', 'manager']), workflowValidator.create, workflowController.create);

// Update workflow
router.put('/:id', roleMiddleware(['admin', 'manager']), workflowValidator.update, workflowController.update);

// Delete workflow
router.delete('/:id', roleMiddleware(['admin', 'manager']), workflowController.delete);

// Execute workflow
router.post('/:id/execute', workflowController.execute);

// Get workflow version history
router.get('/:id/versions', workflowController.getVersions);

// Rollback workflow
router.post('/:id/rollback', roleMiddleware(['admin', 'manager']), workflowController.rollback);

module.exports = router;


