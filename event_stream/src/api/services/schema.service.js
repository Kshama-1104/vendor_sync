const logger = require('../../core/logger');
const schemaManager = require('../../core/schema-registry/schema-manager');
const compatibilityChecker = require('../../core/schema-registry/compatibility-checker');

class SchemaService {
  async register(topicName, schema) {
    try {
      const registered = await schemaManager.register(topicName, schema);
      logger.info(`Schema registered for topic: ${topicName}`);
      return registered;
    } catch (error) {
      logger.error(`Error registering schema for topic ${topicName}:`, error);
      throw error;
    }
  }

  async get(topicName, version) {
    try {
      const schema = await schemaManager.get(topicName, version);
      return schema;
    } catch (error) {
      logger.error(`Error getting schema for topic ${topicName}:`, error);
      throw error;
    }
  }

  async validate(topicName, eventValue) {
    try {
      const schema = await schemaManager.getLatest(topicName);
      if (!schema) {
        // No schema registered, allow any event
        return true;
      }

      // Validate event against schema
      const isValid = this.validateAgainstSchema(schema, eventValue);
      if (!isValid) {
        throw new Error('Event does not match schema');
      }

      return true;
    } catch (error) {
      logger.error(`Error validating event for topic ${topicName}:`, error);
      throw error;
    }
  }

  async checkCompatibility(topicName, newSchema) {
    try {
      const currentSchema = await schemaManager.getLatest(topicName);
      if (!currentSchema) {
        return { compatible: true };
      }

      const compatible = await compatibilityChecker.check(currentSchema, newSchema);
      return { compatible };
    } catch (error) {
      logger.error(`Error checking compatibility for topic ${topicName}:`, error);
      throw error;
    }
  }

  validateAgainstSchema(schema, value) {
    // Simplified schema validation
    // In production, use a proper schema validator like AJV
    if (schema.type === 'object' && typeof value === 'object') {
      return true;
    }
    return false;
  }
}

module.exports = new SchemaService();


