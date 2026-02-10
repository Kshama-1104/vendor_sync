require('dotenv').config();

module.exports = {
  engine: {
    enabled: true,
    maxStages: 50,
    maxTransitions: 100,
    executionTimeout: 30000,
    enableRollback: true
  },
  stages: {
    types: [
      'start',
      'normal',
      'approval',
      'parallel',
      'conditional',
      'end'
    ]
  },
  transitions: {
    types: [
      'auto',
      'conditional',
      'approval',
      'time-based'
    ],
    defaultTimeout: 3600000 // 1 hour
  },
  approvals: {
    maxLevels: 10,
    defaultTimeout: 86400000, // 24 hours
    autoApproveEnabled: true,
    escalationEnabled: true
  },
  stateMachine: {
    enableHistory: true,
    maxHistorySize: 100,
    enableRollback: true
  }
};


