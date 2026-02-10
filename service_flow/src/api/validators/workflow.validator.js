/**
 * Workflow Validator
 */

const WORKFLOW_TYPES = ['sequential', 'parallel', 'conditional'];
const STEP_TYPES = ['task', 'approval', 'notification', 'condition', 'parallel', 'wait'];

/**
 * Validate Create Workflow
 */
const validateCreateWorkflow = (req, res, next) => {
  const errors = [];
  const { name, description, type, steps, triggers } = req.body;

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Workflow name is required' });
  } else if (name.length < 3 || name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be between 3 and 100 characters' });
  }

  // Type validation
  if (type && !WORKFLOW_TYPES.includes(type)) {
    errors.push({ 
      field: 'type', 
      message: `Type must be one of: ${WORKFLOW_TYPES.join(', ')}` 
    });
  }

  // Steps validation
  if (steps && Array.isArray(steps)) {
    steps.forEach((step, index) => {
      if (!step.name) {
        errors.push({ field: `steps[${index}].name`, message: 'Step name is required' });
      }
      if (step.type && !STEP_TYPES.includes(step.type)) {
        errors.push({ 
          field: `steps[${index}].type`, 
          message: `Step type must be one of: ${STEP_TYPES.join(', ')}` 
        });
      }
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
 * Validate Update Workflow
 */
const validateUpdateWorkflow = (req, res, next) => {
  const errors = [];
  const { name, type, steps } = req.body;

  // Name validation (optional)
  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 3 || name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be between 3 and 100 characters' });
    }
  }

  // Type validation (optional)
  if (type && !WORKFLOW_TYPES.includes(type)) {
    errors.push({ 
      field: 'type', 
      message: `Type must be one of: ${WORKFLOW_TYPES.join(', ')}` 
    });
  }

  // Steps validation (optional)
  if (steps && Array.isArray(steps)) {
    steps.forEach((step, index) => {
      if (step.type && !STEP_TYPES.includes(step.type)) {
        errors.push({ 
          field: `steps[${index}].type`, 
          message: `Step type must be one of: ${STEP_TYPES.join(', ')}` 
        });
      }
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
 * Validate Workflow ID
 */
const validateWorkflowId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Workflow ID is required'
    });
  }

  next();
};

/**
 * Validate Step
 */
const validateStep = (req, res, next) => {
  const errors = [];
  const { name, type, action, assignee } = req.body;

  if (!name || typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Step name is required' });
  }

  if (type && !STEP_TYPES.includes(type)) {
    errors.push({ 
      field: 'type', 
      message: `Step type must be one of: ${STEP_TYPES.join(', ')}` 
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

module.exports = {
  validateCreateWorkflow,
  validateUpdateWorkflow,
  validateWorkflowId,
  validateStep,
  // Aliases for route compatibility
  create: validateCreateWorkflow,
  update: validateUpdateWorkflow
};
