module.exports = (sequelize, DataTypes) => {
  const SyncLog = sequelize.define('SyncLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    syncType: {
      type: DataTypes.ENUM('inventory', 'pricing', 'order', 'catalog'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'partial'),
      allowNull: false
    },
    recordsProcessed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    recordsSucceeded: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    recordsFailed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    errorMessage: {
      type: DataTypes.TEXT
    },
    startedAt: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    durationMs: {
      type: DataTypes.INTEGER
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    tableName: 'sync_logs',
    timestamps: true
  });

  return SyncLog;
};


