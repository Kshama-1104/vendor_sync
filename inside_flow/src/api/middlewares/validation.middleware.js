const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

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

module.exports = validate;


