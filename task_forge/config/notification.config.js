require('dotenv').config();

module.exports = {
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    },
    from: process.env.SMTP_FROM || 'noreply@taskforge.com'
  },
  push: {
    enabled: process.env.PUSH_ENABLED === 'true',
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
  },
  inApp: {
    enabled: true,
    retentionDays: 30
  },
  templates: {
    taskAssigned: 'task_assigned',
    taskDue: 'task_due',
    taskOverdue: 'task_overdue',
    commentAdded: 'comment_added',
    mention: 'mention'
  },
  preferences: {
    default: {
      email: true,
      push: true,
      inApp: true
    }
  }
};


