/**
 * Approval Validator
 */

const APPROVAL_ACTIONS = ['approve', 'reject', 'escalate', 'delegate'];

/**
 * Validate Approval Action
 */
const validateApprovalAction = (req, res, next) => {
  const errors = [];
  const { action, comments, delegateTo } = req.body;

  // Action validation
  if (!action || typeof action !== 'string') {
    errors.push({ field: 'action', message: 'Approval action is required' });
  } else if (!APPROVAL_ACTIONS.includes(action)) {
    errors.push({ 
      field: 'action', 
      message: `Action must be one of: ${APPROVAL_ACTIONS.join(', ')}` 
    });
  }

  // Comments required for rejection
  if (action === 'reject' && (!comments || comments.length < 10)) {
    errors.push({ field: 'comments', message: 'Comments are required for rejection (min 10 characters)' });
  }

  // Delegate to required for delegation
  if (action === 'delegate' && !delegateTo) {
    errors.push({ field: 'delegateTo', message: 'Delegate to user is required for delegation' });
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
 * Validate Create Approval Request
 */
const validateCreateApproval = (req, res, next) => {
  const errors = [];
  const { serviceId, approvers, level, dueDate } = req.body;

  // Service ID validation
  if (!serviceId) {
    errors.push({ field: 'serviceId', message: 'Service ID is required' });
  }

  // Approvers validation
  if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
    errors.push({ field: 'approvers', message: 'At least one approver is required' });
  }

  // Level validation
  if (level !== undefined && (typeof level !== 'number' || level < 1)) {
    errors.push({ field: 'level', message: 'Level must be a positive number' });
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
 * Validate Approval ID
 */
const validateApprovalId = (req, res, next) => {
  const { id, approvalId } = req.params;
  const idToValidate = id || approvalId;

  if (!idToValidate) {
    return res.status(400).json({
      success: false,
      message: 'Approval ID is required'
    });
  }

  next();
};

/**
 * Validate Bulk Approval
 */
const validateBulkApproval = (req, res, next) => {
  const errors = [];
  const { approvalIds, action, comments } = req.body;

  // Approval IDs validation
  if (!approvalIds || !Array.isArray(approvalIds) || approvalIds.length === 0) {
    errors.push({ field: 'approvalIds', message: 'At least one approval ID is required' });
  }

  // Action validation
  if (!action || !APPROVAL_ACTIONS.includes(action)) {
    errors.push({ 
      field: 'action', 
      message: `Action must be one of: ${APPROVAL_ACTIONS.join(', ')}` 
    });
  }

  // Comments required for rejection
  if (action === 'reject' && (!comments || comments.length < 10)) {
    errors.push({ field: 'comments', message: 'Comments are required for rejection' });
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
  validateApprovalAction,
  validateCreateApproval,
  validateApprovalId,
  validateBulkApproval,
  // Aliases for route compatibility
  action: validateApprovalAction,
  create: validateCreateApproval,
  bulk: validateBulkApproval,
  approve: validateApprovalId, // Just validate ID for approve
  reject: validateApprovalAction // Validate action for reject (requires comments)
};
