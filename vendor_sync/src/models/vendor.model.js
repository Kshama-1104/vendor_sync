// Sequelize model would go here
// This is a placeholder structure

module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('supplier', 'service_provider', 'partner'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'inactive', 'suspended'),
      defaultValue: 'pending'
    },
    integrationType: {
      type: DataTypes.ENUM('api', 'ftp', 'webhook', 'file'),
      allowNull: false
    },
    config: {
      type: DataTypes.JSONB
    },
    apiKey: {
      type: DataTypes.STRING
    },
    apiSecret: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'vendors',
    timestamps: true
  });

  return Vendor;
};


