module.exports = {
  name: 'User',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    email: { type: 'STRING', allowNull: false, unique: true },
    password: { type: 'STRING', allowNull: false },
    name: { type: 'STRING', allowNull: false },
    roles: { type: 'ARRAY', defaultValue: ['user'] },
    mfaEnabled: { type: 'BOOLEAN', defaultValue: false },
    mfaSecret: { type: 'STRING', allowNull: true },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false }
  }
};


