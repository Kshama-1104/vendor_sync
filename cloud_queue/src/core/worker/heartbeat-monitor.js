const logger = require('../logger');
const workerManager = require('./worker-manager');
const workerConfig = require('../../../config/worker.config');

class HeartbeatMonitor {
  constructor() {
    this.interval = null;
    this.unhealthyWorkers = new Map();
  }

  start() {
    const interval = workerConfig.health.checkInterval || 60000;

    this.interval = setInterval(() => {
      this.checkWorkers();
    }, interval);

    logger.info('Heartbeat monitor started');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      logger.info('Heartbeat monitor stopped');
    }
  }

  async checkWorkers() {
    try {
      const workers = await workerManager.list();
      const now = new Date();
      const threshold = workerConfig.health.checkInterval * 2;

      for (const worker of workers) {
        const lastHeartbeat = new Date(worker.lastHeartbeat);
        const timeSinceHeartbeat = now - lastHeartbeat;

        if (timeSinceHeartbeat > threshold) {
          // Worker is unhealthy
          const count = (this.unhealthyWorkers.get(worker.id) || 0) + 1;
          this.unhealthyWorkers.set(worker.id, count);

          if (count >= workerConfig.health.unhealthyThreshold) {
            logger.warn(`Worker ${worker.id} is unhealthy, marking as inactive`);
            await workerManager.update(worker.id, { status: 'inactive' });

            if (workerConfig.health.autoRestart) {
              // Auto-restart logic would go here
              logger.info(`Attempting to restart worker ${worker.id}`);
            }
          }
        } else {
          // Worker is healthy
          this.unhealthyWorkers.delete(worker.id);
        }
      }
    } catch (error) {
      logger.error('Error checking worker health:', error);
    }
  }
}

module.exports = new HeartbeatMonitor();


