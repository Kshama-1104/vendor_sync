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

const trigger = [
  body('vendorId')
    .notEmpty().withMessage('Vendor ID is required')
    .isInt().withMessage('Vendor ID must be an integer'),
  body('type')
    .notEmpty().withMessage('Sync type is required')
    .isIn(['inventory', 'pricing', 'order', 'catalog', 'all']).withMessage('Invalid sync type'),
  body('force')
    .optional()
    .isBoolean().withMessage('Force must be a boolean'),
  handleValidationErrors
];

module.exports = {
  trigger
};


