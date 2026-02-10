module.exports = (sequelize, DataTypes) => {
  const Workflow = sequelize.define('Workflow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id'
      }
    },
    stages: {
      type: DataTypes.JSONB
    },
    rules: {
      type: DataTypes.JSONB
    }
  }, {
    tableName: 'workflows',
    timestamps: true
  });

  return Workflow;
};


