const logger = require('../logger');

class WindowProcessor {
  async process(events, config) {
    try {
      switch (config.type) {
        case 'time':
          return this.processTimeWindow(events, config);
        case 'count':
          return this.processCountWindow(events, config);
        case 'session':
          return this.processSessionWindow(events, config);
        default:
          return events;
      }
    } catch (error) {
      logger.error('Error processing window:', error);
      throw error;
    }
  }

  processTimeWindow(events, config) {
    const windowSize = config.size || 60000; // 1 minute default
    const windows = [];
    let currentWindow = [];
    let windowStart = null;

    for (const event of events) {
      const eventTime = new Date(event.timestamp).getTime();

      if (!windowStart) {
        windowStart = eventTime;
      }

      if (eventTime - windowStart < windowSize) {
        currentWindow.push(event);
      } else {
        if (currentWindow.length > 0) {
          windows.push(currentWindow);
        }
        currentWindow = [event];
        windowStart = eventTime;
      }
    }

    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }

    return windows;
  }

  processCountWindow(events, config) {
    const windowSize = config.size || 100;
    const windows = [];

    for (let i = 0; i < events.length; i += windowSize) {
      windows.push(events.slice(i, i + windowSize));
    }

    return windows;
  }

  processSessionWindow(events, config) {
    const inactivityGap = config.inactivityGap || 300000; // 5 minutes default
    const sessions = [];
    let currentSession = [];
    let lastEventTime = null;

    for (const event of events) {
      const eventTime = new Date(event.timestamp).getTime();

      if (!lastEventTime || eventTime - lastEventTime < inactivityGap) {
        currentSession.push(event);
      } else {
        if (currentSession.length > 0) {
          sessions.push(currentSession);
        }
        currentSession = [event];
      }

      lastEventTime = eventTime;
    }

    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    return sessions;
  }
}

module.exports = new WindowProcessor();


