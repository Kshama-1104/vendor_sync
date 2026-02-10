module.exports = (sequelize, DataTypes) => {
  const Pricing = sequelize.define('Pricing', {
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
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    contractPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    effectiveFrom: {
      type: DataTypes.DATE
    },
    effectiveTo: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'pricing',
    timestamps: true
  });

  return Pricing;
};


