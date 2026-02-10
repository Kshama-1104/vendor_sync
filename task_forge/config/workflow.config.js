require('dotenv').config();

module.exports = {
  engine: {
    enabled: true,
    maxRulesPerWorkflow: 50,
    maxActionsPerRule: 10,
    evaluationTimeout: 5000
  },
  triggers: {
    events: [
      'task.created',
      'task.updated',
      'task.status.changed',
      'task.due_date.approaching',
      'task.overdue',
      'comment.added',
      'attachment.added'
    ],
    schedules: {
      enabled: true,
      timezone: 'UTC'
    }
  },
  actions: {
    task: [
      'assign',
      'update_status',
      'set_priority',
      'add_tag',
      'set_due_date',
      'move_to_stage'
    ],
    notification: [
      'notify',
      'email',
      'escalate'
    ],
    workflow: [
      'move_to_stage',
      'trigger_workflow'
    ]
  },
  conditions: {
    operators: [
      'equals',
      'not_equals',
      'greater_than',
      'less_than',
      'contains',
      'in',
      'not_in'
    ]
  },
  sla: {
    enabled: true,
    defaultResponseTime: 24, // hours
    defaultResolutionTime: 72, // hours
    escalationEnabled: true
  }
};


