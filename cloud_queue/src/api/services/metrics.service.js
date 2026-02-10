const logger = require('../../core/logger');
const inMemoryBroker = require('../../core/broker/in-memory-broker');
const workerManager = require('../../core/worker/worker-manager');

class MetricsService {
  async getQueueMetrics(queueName, startDate, endDate) {
    try {
      const stats = await inMemoryBroker.getQueueStats(queueName);

      return {
        queueName,
        period: { startDate, endDate },
        metrics: {
          queueDepth: stats.depth || 0,
          messagesPublished: stats.published || 0,
          messagesConsumed: stats.consumed || 0,
          messagesInFlight: stats.inFlight || 0,
          averageLatency: stats.averageLatency || 0,
          throughput: stats.throughput || 0
        },
        timestamps: {
          startDate: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error(`Error getting queue metrics for ${queueName}:`, error);
      throw error;
    }
  }

  async getWorkerMetrics() {
    try {
      const workers = await workerManager.list();
      
      const metrics = {
        totalWorkers: workers.length,
        activeWorkers: workers.filter(w => w.status === 'active').length,
        idleWorkers: workers.filter(w => w.status === 'idle').length,
        processingWorkers: workers.filter(w => w.status === 'processing').length,
        averageProcessingTime: 0,
        totalMessagesProcessed: 0,
        totalMessagesFailed: 0
      };

      return metrics;
    } catch (error) {
      logger.error('Error getting worker metrics:', error);
      throw error;
    }
  }

  async getSystemMetrics() {
    try {
      const queueStats = await inMemoryBroker.getAllQueueStats();
      const workerStats = await this.getWorkerMetrics();

      return {
        queues: {
          total: queueStats.length,
          totalDepth: queueStats.reduce((sum, q) => sum + (q.depth || 0), 0),
          totalThroughput: queueStats.reduce((sum, q) => sum + (q.throughput || 0), 0)
        },
        workers: workerStats,
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        }
      };
    } catch (error) {
      logger.error('Error getting system metrics:', error);
      throw error;
    }
  }

  async getConsumerLag(queueName) {
    try {
      const stats = await inMemoryBroker.getQueueStats(queueName);
      const workers = await workerManager.list({ queueName });

      const totalProcessingCapacity = workers.reduce((sum, w) => sum + (w.concurrency || 0), 0);
      const queueDepth = stats.depth || 0;

      return {
        queueName,
        queueDepth,
        activeConsumers: workers.length,
        totalProcessingCapacity,
        estimatedLag: Math.max(0, queueDepth - totalProcessingCapacity),
        averageProcessingTime: stats.averageProcessingTime || 0,
        estimatedTimeToProcess: queueDepth > 0 ? (queueDepth / totalProcessingCapacity) * (stats.averageProcessingTime || 1) : 0
      };
    } catch (error) {
      logger.error(`Error getting consumer lag for ${queueName}:`, error);
      throw error;
    }
  }
}

module.exports = new MetricsService();


