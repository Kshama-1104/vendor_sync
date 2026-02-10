const EventEmitter = require('events');
const logger = require('../../core/logger');
const auditService = require('../services/audit.service');

class LoginEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  emit(event, data) {
    logger.debug(`Login event: ${event}`, data);
    super.emit(event, data);
  }
}

const loginEvents = new LoginEventEmitter();

loginEvents.on('login.success', async (data) => {
  await auditService.logAuth('login.success', data.userId, {
    ip: data.ip,
    userAgent: data.userAgent
  });
});

loginEvents.on('login.failure', async (data) => {
  await auditService.logAuth('login.failure', null, {
    email: data.email,
    ip: data.ip,
    userAgent: data.userAgent,
    error: data.error
  });
});

module.exports = loginEvents;


