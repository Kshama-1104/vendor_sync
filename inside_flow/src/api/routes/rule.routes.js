const express = require('express');
const router = express.Router({ mergeParams: true });
const ruleController = require('../controllers/rule.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get flow rules
router.get('/', ruleController.getRules);

// Get rule by ID
router.get('/:ruleId', ruleController.getById);

// Create rule
router.post('/', roleMiddleware(['admin', 'flowManager']), ruleController.create);

// Update rule
router.put('/:ruleId', roleMiddleware(['admin', 'flowManager']), ruleController.update);

// Delete rule
router.delete('/:ruleId', roleMiddleware(['admin', 'flowManager']), ruleController.delete);

// Evaluate rule
router.post('/:ruleId/evaluate', ruleController.evaluate);

module.exports = router;


