const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const auditLogPath = process.env.AUDIT_LOG_PATH || './logs/audit.log';
const logDir = path.dirname(auditLogPath);

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'vendor-sync-audit' },
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d' // Keep audit logs for 90 days
    })
  ]
});

class AuditLogger {
  static log(action, details) {
    auditLogger.info({
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  static logSync(vendorId, syncType, status, details = {}) {
    this.log('sync', {
      vendorId,
      syncType,
      status,
      ...details
    });
  }

  static logDataChange(entityType, entityId, action, userId, changes) {
    this.log('data_change', {
      entityType,
      entityId,
      action,
      userId,
      changes
    });
  }

  static logAccess(resource, userId, action, success) {
    this.log('access', {
      resource,
      userId,
      action,
      success
    });
  }

  static logError(error, context) {
    auditLogger.error({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = AuditLogger;


