require('dotenv').config();

module.exports = {
  enabled: true,
  defaultResponseTime: 4, // hours
  defaultResolutionTime: 24, // hours
  priorityBased: {
    urgent: {
      responseTime: 1, // hours
      resolutionTime: 4 // hours
    },
    high: {
      responseTime: 4, // hours
      resolutionTime: 24 // hours
    },
    medium: {
      responseTime: 8, // hours
      resolutionTime: 48 // hours
    },
    low: {
      responseTime: 24, // hours
      resolutionTime: 120 // hours (5 days)
    }
  },
  monitoring: {
    checkInterval: 300000, // 5 minutes
    breachDetectionEnabled: true,
    autoEscalationEnabled: true
  },
  escalation: {
    responseBreach: {
      enabled: true,
      action: 'escalate',
      target: 'manager'
    },
    resolutionBreach: {
      enabled: true,
      action: 'escalate',
      target: 'director'
    }
  },
  reporting: {
    dailyReport: true,
    weeklyReport: true,
    monthlyReport: true
  }
};


