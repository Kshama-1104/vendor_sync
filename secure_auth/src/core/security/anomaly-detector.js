const logger = require('../logger');

class AnomalyDetector {
  async detect(userId, event, context) {
    // In production, implement anomaly detection logic
    logger.debug(`Anomaly detection for user ${userId}: ${event}`);
    return { suspicious: false };
  }
}

module.exports = new AnomalyDetector();


