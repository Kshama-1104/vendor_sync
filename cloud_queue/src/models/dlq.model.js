// Dead Letter Queue model would be defined using Sequelize or similar ORM
// This is a placeholder structure

module.exports = {
  name: 'DLQ',
  attributes: {
    id: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    messageId: { type: 'STRING', allowNull: false },
    originalQueueName: { type: 'STRING', allowNull: false },
    dlqName: { type: 'STRING', allowNull: false },
    body: { type: 'TEXT', allowNull: false },
    attributes: { type: 'JSONB', allowNull: true },
    error: { type: 'TEXT', allowNull: true },
    receiveCount: { type: 'INTEGER', defaultValue: 0 },
    movedAt: { type: 'DATE', allowNull: false },
    createdAt: { type: 'DATE', allowNull: false }
  }
};


