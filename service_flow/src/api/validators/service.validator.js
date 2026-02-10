const { SERVICE_PRIORITY, SERVICE_TYPE } = require('../../utils/constants');

/**
 * Validate Create Service Request
 */
const validateCreateService = (req, res, next) => {
  const errors = [];
  const { title, description, type, priority, categoryId } = req.body;

  // Title validation
  if (!title || typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length < 5 || title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be between 5 and 200 characters' });
  }

  // Description validation
  if (!description || typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  }

  // Type validation
  if (type && !Object.values(SERVICE_TYPE).includes(type)) {
    errors.push({ 
      field: 'type', 
      message: `Type must be one of: ${Object.values(SERVICE_TYPE).join(', ')}` 
    });
  }

  // Priority validation
  if (priority && !Object.values(SERVICE_PRIORITY).includes(priority)) {
    errors.push({ 
      field: 'priority', 
      message: `Priority must be one of: ${Object.values(SERVICE_PRIORITY).join(', ')}` 
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Update Service Request
 */
const validateUpdateService = (req, res, next) => {
  const errors = [];
  const { title, description, type, priority, status } = req.body;

  // Title validation (optional)
  if (title !== undefined) {
    if (typeof title !== 'string' || title.length < 5 || title.length > 200) {
      errors.push({ field: 'title', message: 'Title must be between 5 and 200 characters' });
    }
  }

  // Description validation (optional)
  if (description !== undefined) {
    if (typeof description !== 'string' || description.length < 10) {
      errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
    }
  }

  // Type validation (optional)
  if (type && !Object.values(SERVICE_TYPE).includes(type)) {
    errors.push({ 
      field: 'type', 
      message: `Type must be one of: ${Object.values(SERVICE_TYPE).join(', ')}` 
    });
  }

  // Priority validation (optional)
  if (priority && !Object.values(SERVICE_PRIORITY).includes(priority)) {
    errors.push({ 
      field: 'priority', 
      message: `Priority must be one of: ${Object.values(SERVICE_PRIORITY).join(', ')}` 
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Service ID Parameter
 */
const validateServiceId = (req, res, next) => {
  const { id, serviceId } = req.params;
  const idToValidate = id || serviceId;

  if (!idToValidate) {
    return res.status(400).json({
      success: false,
      message: 'Service ID is required'
    });
  }

  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(idToValidate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Service ID format'
    });
  }

  next();
};

/**
 * Validate Comment
 */
const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Comment content is required'
    });
  }

  if (content.length < 1 || content.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be between 1 and 2000 characters'
    });
  }

  next();
};

/**
 * Validate Attachment
 */
const validateAttachment = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'File is required'
    });
  }

  // Max file size: 10MB
  const maxSize = 10 * 1024 * 1024;
  const files = req.files || [req.file];
  
  for (const file of files) {
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size must not exceed 10MB'
      });
    }
  }

  next();
};

module.exports = {
  validateCreateService,
  validateUpdateService,
  validateServiceId,
  validateComment,
  validateAttachment,
  // Aliases for route compatibility
  create: validateCreateService,
  update: validateUpdateService
};
