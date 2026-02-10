const EventEmitter = require('events');
const logger = require('../../core/logger');

class TransitionEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  emit(event, data) {
    logger.debug(`Transition event emitted: ${event}`, data);
    super.emit(event, data);
  }
}

const transitionEvents = new TransitionEventEmitter();

// Event handlers
transitionEvents.on('transition.validated', (data) => {
  logger.debug(`Transition validated: ${data.from} -> ${data.to}`);
});

transitionEvents.on('transition.completed', (data) => {
  logger.info(`Transition completed: ${data.from} -> ${data.to}`);
});

transitionEvents.on('transition.failed', (data) => {
  logger.error(`Transition failed: ${data.from} -> ${data.to}`, data.error);
});

module.exports = transitionEvents;


