const logger = require('../../core/logger');

class ValidationService {
  async validateInventory(products) {
    const validated = [];

    for (const product of products) {
      try {
        // Validate required fields
        if (!product.sku) {
          throw new Error('SKU is required');
        }

        if (typeof product.quantity !== 'number') {
          throw new Error('Quantity must be a number');
        }

        validated.push(product);
      } catch (error) {
        logger.warn(`Validation failed for product:`, error.message);
      }
    }

    return validated;
  }

  async validatePricing(products) {
    const validated = [];

    for (const product of products) {
      try {
        if (!product.sku) {
          throw new Error('SKU is required');
        }

        if (typeof product.price !== 'number' || product.price < 0) {
          throw new Error('Price must be a positive number');
        }

        validated.push(product);
      } catch (error) {
        logger.warn(`Validation failed for product:`, error.message);
      }
    }

    return validated;
  }

  async validateOrders(orders) {
    const validated = [];

    for (const order of orders) {
      try {
        if (!order.orderNumber) {
          throw new Error('Order number is required');
        }

        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
          throw new Error('Order must have at least one item');
        }

        validated.push(order);
      } catch (error) {
        logger.warn(`Validation failed for order:`, error.message);
      }
    }

    return validated;
  }

  validateSchema(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = new ValidationService();


