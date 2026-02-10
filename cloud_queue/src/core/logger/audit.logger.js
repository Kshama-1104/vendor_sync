const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logDir = process.env.LOG_DIR || './logs';
const auditLogPath = process.env.AUDIT_LOG_PATH || path.join(logDir, 'audit.log');

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cloud-queue', type: 'audit' },
  transports: [
    new DailyRotateFile({
      filename: auditLogPath.replace('.log', '-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d'
    })
  ]
});

const logAudit = (action, details) => {
  auditLogger.info({
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  auditLogger,
  logAudit
};


