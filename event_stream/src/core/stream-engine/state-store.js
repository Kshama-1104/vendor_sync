const logger = require('../logger');

class StateStore {
  constructor() {
    this.states = new Map();
  }

  async get(key) {
    return this.states.get(key) || null;
  }

  async set(key, value) {
    this.states.set(key, value);
    logger.debug(`State stored: ${key}`);
  }

  async delete(key) {
    this.states.delete(key);
  }

  async clear() {
    this.states.clear();
  }
}

module.exports = new StateStore();


