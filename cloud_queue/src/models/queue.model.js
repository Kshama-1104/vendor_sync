// Queue model would be defined using Sequelize or similar ORM
// This is a placeholder structure

module.exports = {
  name: 'Queue',
  attributes: {
    id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    name: { type: 'STRING', allowNull: false, unique: true },
    type: { type: 'STRING', allowNull: false },
    fifo: { type: 'BOOLEAN', defaultValue: false },
    maxMessageSize: { type: 'INTEGER', defaultValue: 262144 },
    messageRetentionPeriod: { type: 'INTEGER', defaultValue: 345600 },
    visibilityTimeout: { type: 'INTEGER', defaultValue: 30 },
    receiveMessageWaitTime: { type: 'INTEGER', defaultValue: 0 },
    maxReceiveCount: { type: 'INTEGER', defaultValue: 3 },
    dlqName: { type: 'STRING', allowNull: true },
    status: { type: 'STRING', defaultValue: 'active' },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false }
  }
};


