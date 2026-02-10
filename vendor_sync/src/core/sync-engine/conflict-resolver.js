const syncConfig = require('../../../config/sync.config');
const logger = require('../logger');

class ConflictResolver {
  resolve(vendorData, internalData, conflictType) {
    const strategy = syncConfig.conflictResolution.strategy;

    switch (strategy) {
      case 'last-write-wins':
        return this.lastWriteWins(vendorData, internalData);
      case 'source-priority':
        return this.sourcePriority(vendorData, internalData);
      case 'merge':
        return this.merge(vendorData, internalData);
      case 'manual-review':
        return this.flagForReview(vendorData, internalData, conflictType);
      default:
        logger.warn(`Unknown conflict resolution strategy: ${strategy}`);
        return this.lastWriteWins(vendorData, internalData);
    }
  }

  lastWriteWins(vendorData, internalData) {
    const vendorTimestamp = new Date(vendorData.updatedAt || vendorData.createdAt);
    const internalTimestamp = new Date(internalData.updatedAt || internalData.createdAt);

    if (vendorTimestamp > internalTimestamp) {
      logger.info('Resolving conflict: vendor data is newer, using vendor data');
      return vendorData;
    } else {
      logger.info('Resolving conflict: internal data is newer, keeping internal data');
      return internalData;
    }
  }

  sourcePriority(vendorData, internalData) {
    const priorities = syncConfig.conflictResolution.sourcePriority;
    const vendorPriority = priorities.indexOf('vendor');
    const internalPriority = priorities.indexOf('internal');

    if (vendorPriority < internalPriority) {
      logger.info('Resolving conflict: vendor has higher priority');
      return vendorData;
    } else {
      logger.info('Resolving conflict: internal has higher priority');
      return internalData;
    }
  }

  merge(vendorData, internalData) {
    logger.info('Merging vendor and internal data');
    
    // Merge strategy: combine non-conflicting fields, use vendor for conflicting fields
    const merged = {
      ...internalData,
      ...vendorData,
      // Preserve internal metadata
      id: internalData.id,
      createdAt: internalData.createdAt,
      // Use vendor data for business fields
      ...vendorData
    };

    return merged;
  }

  flagForReview(vendorData, internalData, conflictType) {
    logger.warn(`Flagging conflict for manual review: ${conflictType}`);
    
    return {
      ...internalData,
      _conflict: {
        type: conflictType,
        vendorData,
        internalData,
        flaggedAt: new Date(),
        requiresReview: true
      }
    };
  }

  detectConflict(vendorData, internalData) {
    const conflicts = [];

    // Check for data conflicts
    if (vendorData.quantity !== internalData.quantity) {
      conflicts.push({
        field: 'quantity',
        vendorValue: vendorData.quantity,
        internalValue: internalData.quantity,
        type: 'data'
      });
    }

    if (vendorData.price !== internalData.price) {
      conflicts.push({
        field: 'price',
        vendorValue: vendorData.price,
        internalValue: internalData.price,
        type: 'data'
      });
    }

    // Check for version conflicts
    if (vendorData.version && internalData.version && 
        vendorData.version !== internalData.version) {
      conflicts.push({
        field: 'version',
        vendorValue: vendorData.version,
        internalValue: internalData.version,
        type: 'version'
      });
    }

    return conflicts;
  }
}

module.exports = new ConflictResolver();


