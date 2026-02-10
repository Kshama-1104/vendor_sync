module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
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
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    expectedDelivery: {
      type: DataTypes.DATE
    },
    actualDelivery: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'orders',
    timestamps: true
  });

  return Order;
};


