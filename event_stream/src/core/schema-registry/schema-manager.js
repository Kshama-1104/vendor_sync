const logger = require('../logger');

class SchemaManager {
  constructor() {
    this.schemas = new Map();
  }

  async register(topicName, schema) {
    try {
      const version = this.getNextVersion(topicName);
      const registered = {
        topic: topicName,
        version,
        schema,
        createdAt: new Date()
      };

      const key = `${topicName}:${version}`;
      this.schemas.set(key, registered);

      // Also store as latest
      this.schemas.set(`${topicName}:latest`, registered);

      logger.info(`Schema registered for topic ${topicName} version ${version}`);
      return registered;
    } catch (error) {
      logger.error(`Error registering schema: ${error.message}`);
      throw error;
    }
  }

  async get(topicName, version) {
    const key = version ? `${topicName}:${version}` : `${topicName}:latest`;
    return this.schemas.get(key) || null;
  }

  async getLatest(topicName) {
    return this.get(topicName, 'latest');
  }

  getNextVersion(topicName) {
    let maxVersion = 0;
    for (const [key] of this.schemas) {
      if (key.startsWith(`${topicName}:`) && !key.endsWith(':latest')) {
        const version = parseInt(key.split(':')[1]);
        if (version > maxVersion) {
          maxVersion = version;
        }
      }
    }
    return maxVersion + 1;
  }
}

module.exports = new SchemaManager();


