const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const sendSchema = Joi.object({
  body: Joi.alternatives().try(
    Joi.string(),
    Joi.object()
  ).required(),
  attributes: Joi.object().optional(),
  priority: Joi.number().integer().min(1).max(10).optional(),
  delaySeconds: Joi.number().integer().min(0).max(900).default(0),
  messageGroupId: Joi.string().optional()
});

const sendBatchSchema = Joi.object({
  messages: Joi.array().items(
    Joi.object({
      body: Joi.alternatives().try(
        Joi.string(),
        Joi.object()
      ).required(),
      attributes: Joi.object().optional(),
      priority: Joi.number().integer().min(1).max(10).optional(),
      delaySeconds: Joi.number().integer().min(0).max(900).default(0)
    })
  ).min(1).max(10).required()
});

const changeVisibilitySchema = Joi.object({
  visibilityTimeout: Joi.number().integer().min(0).max(43200).required()
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
  send: validate(sendSchema),
  sendBatch: validate(sendBatchSchema),
  changeVisibility: validate(changeVisibilitySchema)
};


