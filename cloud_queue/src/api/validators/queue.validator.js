const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const createSchema = Joi.object({
  name: Joi.string().required().min(1).max(80),
  type: Joi.string().valid('standard', 'priority', 'delay', 'fifo').default('standard'),
  fifo: Joi.boolean().default(false),
  maxMessageSize: Joi.number().integer().min(1024).max(262144).default(262144),
  messageRetentionPeriod: Joi.number().integer().min(60).max(1209600).default(345600),
  visibilityTimeout: Joi.number().integer().min(0).max(43200).default(30),
  receiveMessageWaitTime: Joi.number().integer().min(0).max(20).default(0),
  maxReceiveCount: Joi.number().integer().min(1).max(100).default(3),
  dlqName: Joi.string().optional()
});

const updateSchema = Joi.object({
  maxMessageSize: Joi.number().integer().min(1024).max(262144).optional(),
  messageRetentionPeriod: Joi.number().integer().min(60).max(1209600).optional(),
  visibilityTimeout: Joi.number().integer().min(0).max(43200).optional(),
  receiveMessageWaitTime: Joi.number().integer().min(0).max(20).optional(),
  maxReceiveCount: Joi.number().integer().min(1).max(100).optional()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json(
        responseUtil.error('Validation error', 400, { errors })
      );
    }

    req.body = value;
    next();
  };
};

module.exports = {
  create: validate(createSchema),
  update: validate(updateSchema)
};


