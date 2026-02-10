module.exports = {
  name: 'Session',
  attributes: {
    id: { type: 'STRING', primaryKey: true },
    userId: { type: 'STRING', allowNull: false },
    accessToken: { type: 'STRING', allowNull: false },
    ipAddress: { type: 'STRING', allowNull: true },
    userAgent: { type: 'STRING', allowNull: true },
    deviceFingerprint: { type: 'STRING', allowNull: true },
    createdAt: { type: 'DATE', allowNull: false },
    expiresAt: { type: 'DATE', allowNull: false }
  }
};


