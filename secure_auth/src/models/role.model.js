module.exports = {
  name: 'Role',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    name: { type: 'STRING', allowNull: false, unique: true },
    permissions: { type: 'ARRAY', defaultValue: [] },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false }
  }
};


