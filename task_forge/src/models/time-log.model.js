module.exports = (sequelize, DataTypes) => {
  const TimeLog = sequelize.define('TimeLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
    duration: {
      type: DataTypes.INTEGER // in seconds
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'time_logs',
    timestamps: true
  });

  return TimeLog;
};


