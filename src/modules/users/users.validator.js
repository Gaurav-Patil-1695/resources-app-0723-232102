const Joi = require('joi');

const updateProfile = Joi.object({
  firstName: Joi.string().min(1).max(100).optional()
    .messages({
      'string.min': 'First name must be at least 1 character.',
      'string.max': 'First name must not exceed 100 characters.',
    }),
  lastName: Joi.string().min(1).max(100).optional()
    .messages({
      'string.min': 'Last name must be at least 1 character.',
      'string.max': 'Last name must not exceed 100 characters.',
    }),
  email: Joi.string().email().max(255).optional()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.max': 'Email must not exceed 255 characters.',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

const changePassword = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'any.required': 'Current password is required.',
      'string.empty': 'Current password is required.',
    }),
  newPassword: Joi.string().min(8).max(128).required()
    .messages({
      'any.required': 'New password is required.',
      'string.empty': 'New password is required.',
      'string.min': 'New password must be at least 8 characters.',
      'string.max': 'New password must not exceed 128 characters.',
    }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({
      'any.required': 'Password confirmation is required.',
      'string.empty': 'Password confirmation is required.',
      'any.only': 'Passwords do not match.',
    }),
});

const adminUpdateUser = Joi.object({
  firstName: Joi.string().min(1).max(100).optional()
    .messages({
      'string.min': 'First name must be at least 1 character.',
      'string.max': 'First name must not exceed 100 characters.',
    }),
  lastName: Joi.string().min(1).max(100).optional()
    .messages({
      'string.min': 'Last name must be at least 1 character.',
      'string.max': 'Last name must not exceed 100 characters.',
    }),
  email: Joi.string().email().max(255).optional()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.max': 'Email must not exceed 255 characters.',
    }),
  role: Joi.string().valid('admin', 'customer').optional()
    .messages({
      'any.only': 'Role must be one of: admin, customer.',
    }),
  isActive: Joi.boolean().optional()
    .messages({
      'boolean.base': 'isActive must be a boolean value.',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

module.exports = {
  updateProfile,
  changePassword,
  adminUpdateUser,
};
