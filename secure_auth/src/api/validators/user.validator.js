const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(12).required()
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
  update: validate(updateSchema),
  changePassword: validate(changePasswordSchema)
};


