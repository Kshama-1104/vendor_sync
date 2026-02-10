const Joi = require('joi');
const responseUtil = require('../../utils/response.util');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(12).required(),
  name: Joi.string().min(2).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordResetConfirmSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(12).required()
});

const mfaVerifySchema = Joi.object({
  code: Joi.string().required(),
  token: Joi.string().required()
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
  register: validate(registerSchema),
  login: validate(loginSchema),
  refresh: validate(refreshSchema),
  passwordResetRequest: validate(passwordResetRequestSchema),
  passwordResetConfirm: validate(passwordResetConfirmSchema),
  mfaVerify: validate(mfaVerifySchema)
};


