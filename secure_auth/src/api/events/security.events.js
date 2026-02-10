const EventEmitter = require('events');
const logger = require('../../core/logger');
const auditService = require('../services/audit.service');

class SecurityEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  emit(event, data) {
    logger.debug(`Security event: ${event}`, data);
    super.emit(event, data);
  }
}

const securityEvents = new SecurityEventEmitter();

securityEvents.on('security.breach', async (data) => {
  await auditService.logSecurity('breach', data);
  logger.warn('Security breach detected', data);
});

securityEvents.on('security.suspicious', async (data) => {
  await auditService.logSecurity('suspicious', data);
  logger.warn('Suspicious activity detected', data);
});

module.exports = securityEvents;


