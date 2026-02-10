module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.INTEGER
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oldValues: {
      type: DataTypes.JSONB
    },
    newValues: {
      type: DataTypes.JSONB
    },
    ipAddress: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true
  });

  return AuditLog;
};


