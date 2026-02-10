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
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['supplier', 'service_provider', 'partner']).withMessage('Invalid vendor type'),
  body('integrationType')
    .notEmpty().withMessage('Integration type is required')
    .isIn(['api', 'ftp', 'webhook', 'file']).withMessage('Invalid integration type'),
  body('config')
    .optional()
    .isObject().withMessage('Config must be an object'),
  handleValidationErrors
];

const update = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body('type')
    .optional()
    .isIn(['supplier', 'service_provider', 'partner']).withMessage('Invalid vendor type'),
  body('status')
    .optional()
    .isIn(['pending', 'active', 'inactive', 'suspended']).withMessage('Invalid status'),
  body('config')
    .optional()
    .isObject().withMessage('Config must be an object'),
  handleValidationErrors
];

module.exports = {
  create,
  update
};


