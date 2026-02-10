const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/database.config');
const logger = require('../core/logger');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    ssl: config.ssl
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch(err => {
    logger.error('Unable to connect to database:', err);
  });

module.exports = sequelize;


