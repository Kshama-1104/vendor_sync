// Service Status Constants
const SERVICE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CLOSED: 'closed'
};

// Service Priority
const SERVICE_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Service Types
const SERVICE_TYPE = {
  IT_SUPPORT: 'it_support',
  HR_REQUEST: 'hr_request',
  FACILITIES: 'facilities',
  PROCUREMENT: 'procurement',
  FINANCE: 'finance',
  GENERAL: 'general'
};

// Workflow Status
const WORKFLOW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
};

// Approval Status
const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  AUTO_APPROVED: 'auto_approved',
  EXPIRED: 'expired'
};

// Task Status
const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  CANCELLED: 'cancelled'
};

// SLA Status
const SLA_STATUS = {
  WITHIN_SLA: 'within_sla',
  AT_RISK: 'at_risk',
  BREACHED: 'breached',
  PAUSED: 'paused'
};

// Notification Types
const NOTIFICATION_TYPE = {
  SERVICE_CREATED: 'service.created',
  SERVICE_UPDATED: 'service.updated',
  SERVICE_COMPLETED: 'service.completed',
  APPROVAL_REQUIRED: 'approval.required',
  APPROVAL_COMPLETED: 'approval.completed',
  SLA_WARNING: 'sla.warning',
  SLA_BREACH: 'sla.breach',
  TASK_ASSIGNED: 'task.assigned'
};

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  USER: 'user'
};

module.exports = {
  SERVICE_STATUS,
  SERVICE_PRIORITY,
  SERVICE_TYPE,
  WORKFLOW_STATUS,
  APPROVAL_STATUS,
  TASK_STATUS,
  SLA_STATUS,
  NOTIFICATION_TYPE,
  USER_ROLES
};
