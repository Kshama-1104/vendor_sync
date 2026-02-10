const logger = require('../../core/logger');
const uuid = require('uuid');

class SessionService {
  constructor() {
    this.sessions = [];
  }

  async create(sessionData) {
    const session = {
      id: uuid.v4(),
      ...sessionData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    this.sessions.push(session);
    return session;
  }

  async getActiveSessions(userId) {
    const now = new Date();
    return this.sessions.filter(s => 
      s.userId === userId && new Date(s.expiresAt) > now
    );
  }

  async getById(id, userId) {
    return this.sessions.find(s => s.id === id && s.userId === userId) || null;
  }

  async revoke(id, userId) {
    const session = await this.getById(id, userId);
    if (session) {
      session.expiresAt = new Date();
    }
    return true;
  }

  async revokeAll(userId) {
    this.sessions.forEach(s => {
      if (s.userId === userId) {
        s.expiresAt = new Date();
      }
    });
    return true;
  }

  async invalidateByToken(token) {
    this.sessions.forEach(s => {
      if (s.accessToken === token) {
        s.expiresAt = new Date();
      }
    });
    return true;
  }
}

module.exports = new SessionService();


