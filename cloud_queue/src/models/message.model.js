// Message model would be defined using Sequelize or similar ORM
// This is a placeholder structure

module.exports = {
  name: 'Message',
  attributes: {
    id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    messageId: { type: 'STRING', allowNull: false, unique: true },
    queueName: { type: 'STRING', allowNull: false },
    body: { type: 'TEXT', allowNull: false },
    attributes: { type: 'JSONB', allowNull: true },
    priority: { type: 'INTEGER', defaultValue: 5 },
    status: { type: 'STRING', defaultValue: 'pending' },
    receiptHandle: { type: 'STRING', allowNull: true },
    receiveCount: { type: 'INTEGER', defaultValue: 0 },
    availableAt: { type: 'DATE', allowNull: false },
    visibleAt: { type: 'DATE', allowNull: true },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false }
  }
};


