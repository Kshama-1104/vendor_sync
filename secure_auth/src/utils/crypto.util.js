const crypto = require('crypto');

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const hashString = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

module.exports = {
  generateRandomString,
  hashString
};


