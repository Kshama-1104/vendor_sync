const { body, validationResult } = require('express-validator');
const responseUtil = require('../../utils/response.util');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      responseUtil.error('Validation failed', 400, 'VALIDATION_ERROR', errors.array())
    );
  }
  next();
};

const create = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
  body('workspaceId')
    .notEmpty().withMessage('Workspace ID is required')
    .isInt().withMessage('Workspace ID must be an integer'),
  body('assigneeId')
    .optional()
    .isInt().withMessage('Assignee ID must be an integer'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors
];

const update = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
  handleValidationErrors
];

module.exports = {
  create,
  update
};


