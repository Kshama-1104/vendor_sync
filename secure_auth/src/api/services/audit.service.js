const logger = require('../../core/logger');
const auditLogger = require('../../core/logger/audit.logger');

class AuditService {
  async log(event, details) {
    auditLogger.logAudit(event, {
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  async logAuth(event, userId, details) {
    await this.log(`auth.${event}`, {
      userId,
      ...details
    });
  }

  async logSecurity(event, details) {
    await this.log(`security.${event}`, details);
  }
}

module.exports = new AuditService();


