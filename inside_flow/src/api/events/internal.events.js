const EventEmitter = require('events');
const logger = require('../../core/logger');

class InternalEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  emit(event, data) {
    logger.debug(`Internal event emitted: ${event}`, data);
    super.emit(event, data);
  }
}

const internalEvents = new InternalEventEmitter();

// Event handlers
internalEvents.on('flow.started', (data) => {
  logger.info(`Flow started: ${data.flowId}`);
});

internalEvents.on('flow.completed', (data) => {
  logger.info(`Flow completed: ${data.flowId}`);
});

internalEvents.on('flow.failed', (data) => {
  logger.error(`Flow failed: ${data.flowId}`, data.error);
});

internalEvents.on('state.entered', (data) => {
  logger.debug(`State entered: ${data.stateId} in flow ${data.flowId}`);
});

internalEvents.on('state.exited', (data) => {
  logger.debug(`State exited: ${data.stateId} in flow ${data.flowId}`);
});

internalEvents.on('transition.triggered', (data) => {
  logger.debug(`Transition triggered: ${data.from} -> ${data.to} in flow ${data.flowId}`);
});

module.exports = internalEvents;


