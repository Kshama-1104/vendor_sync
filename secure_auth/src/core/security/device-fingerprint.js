const crypto = require('crypto');

class DeviceFingerprint {
  generate(req) {
    const components = [
      req.headers['user-agent'],
      req.ip,
      req.headers['accept-language']
    ].filter(Boolean).join('|');

    return crypto.createHash('sha256').update(components).digest('hex');
  }
}

module.exports = new DeviceFingerprint();


