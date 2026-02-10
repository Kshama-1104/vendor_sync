module.exports = {
  name: 'Token',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    userId: { type: 'STRING', allowNull: false },
    token: { type: 'STRING', allowNull: false },
    type: { type: 'STRING', allowNull: false },
    expiresAt: { type: 'DATE', allowNull: false },
    createdAt: { type: 'DATE', allowNull: false }
  }
};


