const express = require('express');
const router = express.Router({ mergeParams: true });
const stateController = require('../controllers/state.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get flow states
router.get('/', stateController.getStates);

// Get state by ID
router.get('/:stateId', stateController.getById);

// Create state
router.post('/', roleMiddleware(['admin', 'flowManager']), stateController.create);

// Update state
router.put('/:stateId', roleMiddleware(['admin', 'flowManager']), stateController.update);

// Delete state
router.delete('/:stateId', roleMiddleware(['admin', 'flowManager']), stateController.delete);

module.exports = router;


