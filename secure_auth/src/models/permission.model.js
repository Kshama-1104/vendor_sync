module.exports = {
  name: 'Permission',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    name: { type: 'STRING', allowNull: false, unique: true },
    resource: { type: 'STRING', allowNull: false },
    action: { type: 'STRING', allowNull: false },
    createdAt: { type: 'DATE', allowNull: false }
  }
};


