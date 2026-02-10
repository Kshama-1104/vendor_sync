const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const produceSchema = Joi.object({
  key: Joi.string().optional(),
  value: Joi.alternatives().try(
    Joi.object(),
    Joi.string(),
    Joi.number(),
    Joi.boolean()
  ).required(),
  headers: Joi.object().optional()
});

const produceBatchSchema = Joi.object({
  events: Joi.array().items(
    Joi.object({
      key: Joi.string().optional(),
      value: Joi.alternatives().try(
        Joi.object(),
        Joi.string(),
        Joi.number(),
        Joi.boolean()
      ).required(),
      headers: Joi.object().optional()
    })
  ).min(1).max(100).required()
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
  produce: validate(produceSchema),
  produceBatch: validate(produceBatchSchema)
};


