const logger = require('../logger');

class EventRouter {
  async route(events, config) {
    try {
      const routed = {
        matched: [],
        unmatched: []
      };

      for (const event of events) {
        if (this.matchesCondition(event, config.condition)) {
          routed.matched.push(event);
        } else {
          routed.unmatched.push(event);
        }
      }

      logger.debug(`Routed ${events.length} events: ${routed.matched.length} matched, ${routed.unmatched.length} unmatched`);
      return routed;
    } catch (error) {
      logger.error('Error routing events:', error);
      throw error;
    }
  }

  matchesCondition(event, condition) {
    try {
      const func = new Function('event', `return ${condition}`);
      return func(event);
    } catch (error) {
      return false;
    }
  }
}

module.exports = new EventRouter();


