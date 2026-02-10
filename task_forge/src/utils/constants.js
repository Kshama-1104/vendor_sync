module.exports = {
  TASK_STATUS: {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    REVIEW: 'review',
    DONE: 'done'
  },

  TASK_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
  },

  WORKSPACE_ROLES: {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer'
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
  },

  VIEW_TYPES: {
    KANBAN: 'kanban',
    LIST: 'list',
    TIMELINE: 'timeline'
  }
};


