const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const createSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  partitions: Joi.number().integer().min(1).max(1000).default(3),
  replicationFactor: Joi.number().integer().min(1).max(10).default(1),
  retentionMs: Joi.number().integer().min(0).default(604800000)
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(responseUtil.error('Validation error', 400, { errors: error.details }));
    }
    req.body = value;
    next();
  };
};

module.exports = {
  create: validate(createSchema)
};


