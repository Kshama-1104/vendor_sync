// Worker model would be defined using Sequelize or similar ORM
// This is a placeholder structure

module.exports = {
  name: 'Worker',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    name: { type: 'STRING', allowNull: false },
    queues: { type: 'ARRAY', allowNull: false },
    concurrency: { type: 'INTEGER', defaultValue: 10 },
    status: { type: 'STRING', defaultValue: 'active' },
    processedCount: { type: 'INTEGER', defaultValue: 0 },
    failedCount: { type: 'INTEGER', defaultValue: 0 },
    registeredAt: { type: 'DATE', allowNull: false },
    lastHeartbeat: { type: 'DATE', allowNull: false },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false }
  }
};


