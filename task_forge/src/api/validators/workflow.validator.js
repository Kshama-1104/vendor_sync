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
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
  body('workspaceId')
    .notEmpty().withMessage('Workspace ID is required')
    .isInt().withMessage('Workspace ID must be an integer'),
  body('stages')
    .optional()
    .isArray().withMessage('Stages must be an array'),
  body('rules')
    .optional()
    .isArray().withMessage('Rules must be an array'),
  handleValidationErrors
];

const update = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
  body('stages')
    .optional()
    .isArray().withMessage('Stages must be an array'),
  body('rules')
    .optional()
    .isArray().withMessage('Rules must be an array'),
  handleValidationErrors
];

module.exports = {
  create,
  update
};


