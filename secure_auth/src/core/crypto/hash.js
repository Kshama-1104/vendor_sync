const bcrypt = require('bcryptjs');
const authConfig = require('../../../config/auth.config');

class Hash {
  async hashPassword(password) {
    const saltRounds = authConfig.password.bcryptRounds;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new Hash();


