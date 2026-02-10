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
  body('vendorId')
    .notEmpty().withMessage('Vendor ID is required')
    .isInt().withMessage('Vendor ID must be an integer'),
  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be an integer'),
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('expectedDelivery')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors
];

const update = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('expectedDelivery')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors
];

module.exports = {
  create,
  update
};


