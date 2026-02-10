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
    from: process.env.SMTP_FROM || 'noreply@serviceflow.com'
  },
  sms: {
    enabled: process.env.SMS_ENABLED === 'true',
    provider: process.env.SMS_PROVIDER || 'twilio',
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET
  },
  inApp: {
    enabled: true,
    retentionDays: 30
  },
  templates: {
    serviceCreated: 'service_created',
    serviceUpdated: 'service_updated',
    approvalRequired: 'approval_required',
    approvalGranted: 'approval_granted',
    approvalRejected: 'approval_rejected',
    slaBreach: 'sla_breach',
    escalation: 'escalation'
  }
};


