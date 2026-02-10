// Audit log model would be defined using Sequelize or similar ORM
// This is a placeholder structure

module.exports = {
  name: 'AuditLog',
  attributes: {
    id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    userId: { type: 'STRING', allowNull: true },
    apiKey: { type: 'STRING', allowNull: true },
    action: { type: 'STRING', allowNull: false },
    resource: { type: 'STRING', allowNull: false },
    resourceId: { type: 'STRING', allowNull: true },
    details: { type: 'JSONB', allowNull: true },
    ipAddress: { type: 'STRING', allowNull: true },
    userAgent: { type: 'STRING', allowNull: true },
    createdAt: { type: 'DATE', allowNull: false }
  }
};


