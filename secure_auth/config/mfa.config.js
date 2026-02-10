require('dotenv').config();

module.exports = {
  enabled: process.env.MFA_ENABLED === 'true',
  requiredForAdmin: process.env.MFA_REQUIRED_FOR_ADMIN === 'true',
  methods: {
    totp: {
      enabled: true,
      issuer: process.env.TOTP_ISSUER || 'Secure Auth',
      algorithm: 'sha1',
      digits: 6,
      period: 30
    },
    sms: {
      enabled: process.env.MFA_SMS_ENABLED === 'true',
      provider: process.env.SMS_PROVIDER || 'twilio',
      apiKey: process.env.SMS_API_KEY,
      apiSecret: process.env.SMS_API_SECRET
    },
    email: {
      enabled: process.env.MFA_EMAIL_ENABLED === 'true',
      smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      }
    }
  },
  backupCodes: {
    count: parseInt(process.env.MFA_BACKUP_CODES_COUNT) || 10,
    length: 8,
    enabled: true
  },
  recovery: {
    enabled: true,
    maxAttempts: 3,
    lockoutDuration: 3600000 // 1 hour
  }
};


