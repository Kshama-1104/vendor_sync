module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reserved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    available: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    reorderPoint: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastSyncedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'inventory',
    timestamps: true
  });

  return Inventory;
};


