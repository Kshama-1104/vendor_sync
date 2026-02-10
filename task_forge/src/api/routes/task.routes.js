const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const taskValidator = require('../validators/task.validator');

// All routes require authentication
router.use(authMiddleware);

// Get all tasks
router.get('/', taskController.getAll);

// Get task by ID
router.get('/:id', taskController.getById);

// Create task
router.post('/', taskValidator.create, taskController.create);

// Update task
router.put('/:id', taskValidator.update, taskController.update);

// Update task status
router.patch('/:id/status', taskController.updateStatus);

// Delete task
router.delete('/:id', roleMiddleware(['admin', 'manager']), taskController.delete);

// Add comment
router.post('/:id/comments', taskController.addComment);

// Get comments
router.get('/:id/comments', taskController.getComments);

// Add attachment
router.post('/:id/attachments', taskController.addAttachment);

// Get attachments
router.get('/:id/attachments', taskController.getAttachments);

// Start time tracking
router.post('/:id/time/start', taskController.startTimeTracking);

// Stop time tracking
router.post('/:id/time/stop', taskController.stopTimeTracking);

// Get time logs
router.get('/:id/time/logs', taskController.getTimeLogs);

module.exports = router;


