const Joi = require('joi');

const handleValidation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      success: false,
      errors: error.details.map((d) => ({ field: d.context && d.context.key ? d.context.key : 'unknown', message: d.message })),
    });
  }
  next();
};

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email must be a valid email address.',
    'any.required': 'email is required.',
    'string.empty': 'email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'password must be at least 8 characters.',
    'any.required': 'password is required.',
    'string.empty': 'password is required.',
  }),
  name: Joi.string().max(255).optional().messages({
    'string.max': 'name must not exceed 255 characters.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email must be a valid email address.',
    'any.required': 'email is required.',
    'string.empty': 'email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'password is required.',
    'string.empty': 'password is required.',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email must be a valid email address.',
    'any.required': 'email is required.',
    'string.empty': 'email is required.',
  }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email must be a valid email address.',
    'any.required': 'email is required.',
    'string.empty': 'email is required.',
  }),
  token: Joi.string().required().messages({
    'any.required': 'token is required.',
    'string.empty': 'token is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'password must be at least 8 characters.',
    'any.required': 'password is required.',
    'string.empty': 'password is required.',
  }),
});

const guestRegisterSchema = Joi.object({
  name: Joi.string().max(255).optional().messages({
    'string.max': 'name must not exceed 255 characters.',
  }),
});

module.exports = {
  validateRegister: handleValidation(registerSchema),
  validateLogin: handleValidation(loginSchema),
  validateForgotPassword: handleValidation(forgotPasswordSchema),
  validateResetPassword: handleValidation(resetPasswordSchema),
  validateGuestRegister: handleValidation(guestRegisterSchema),
};
