const Joi = require('joi');

const DISCOUNT_TYPES = ['percentage', 'fixed'];

/**
 * Schema for validating a promo code (public endpoint).
 */
const validatePromoCode = Joi.object({
  code: Joi.string().trim().min(1).max(64).required().messages({
    'string.empty': 'Promo code is required.',
    'any.required': 'Promo code is required.',
    'string.max': 'Promo code must not exceed 64 characters.',
  }),
  userId: Joi.alternatives()
    .try(Joi.string(), Joi.number().integer().positive())
    .optional()
    .allow(null),
  orderTotal: Joi.number().positive().required().messages({
    'number.base': 'Order total must be a number.',
    'number.positive': 'Order total must be greater than zero.',
    'any.required': 'Order total is required.',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.alternatives()
          .try(Joi.string(), Joi.number().integer().positive())
          .required(),
        quantity: Joi.number().integer().positive().required(),
        price: Joi.number().positive().required(),
      })
    )
    .optional()
    .default([]),
});

/**
 * Schema for creating a new promo code (admin).
 */
const validateCreatePromo = Joi.object({
  code: Joi.string().trim().alphanum().min(3).max(64).required().messages({
    'string.empty': 'Promo code is required.',
    'any.required': 'Promo code is required.',
    'string.alphanum': 'Promo code must contain only letters and numbers.',
    'string.min': 'Promo code must be at least 3 characters.',
    'string.max': 'Promo code must not exceed 64 characters.',
  }),
  discount_type: Joi.string()
    .valid(...DISCOUNT_TYPES)
    .required()
    .messages({
      'any.only': `Discount type must be one of: ${DISCOUNT_TYPES.join(', ')}.`,
      'any.required': 'Discount type is required.',
    }),
  discount_value: Joi.number().positive().required().messages({
    'number.base': 'Discount value must be a number.',
    'number.positive': 'Discount value must be greater than zero.',
    'any.required': 'Discount value is required.',
  }),
  max_discount_amount: Joi.number().positive().optional().allow(null).default(null),
  min_order_amount: Joi.number().min(0).optional().allow(null).default(null),
  max_uses: Joi.number().integer().positive().optional().allow(null).default(null),
  max_uses_per_user: Joi.number().integer().positive().optional().allow(null).default(null),
  starts_at: Joi.date().iso().optional().allow(null).default(null),
  expires_at: Joi.date().iso().greater(Joi.ref('starts_at')).optional().allow(null).default(null).messages({
    'date.greater': 'Expiry date must be after the start date.',
  }),
  is_active: Joi.boolean().optional().default(true),
  description: Joi.string().max(255).optional().allow(null, '').default(null),
});

/**
 * Schema for updating an existing promo code (admin).
 * All fields optional; same constraints as create.
 */
const validateUpdatePromo = Joi.object({
  code: Joi.string().trim().alphanum().min(3).max(64).optional().messages({
    'string.alphanum': 'Promo code must contain only letters and numbers.',
    'string.min': 'Promo code must be at least 3 characters.',
    'string.max': 'Promo code must not exceed 64 characters.',
  }),
  discount_type: Joi.string()
    .valid(...DISCOUNT_TYPES)
    .optional()
    .messages({
      'any.only': `Discount type must be one of: ${DISCOUNT_TYPES.join(', ')}.`,
    }),
  discount_value: Joi.number().positive().optional().messages({
    'number.base': 'Discount value must be a number.',
    'number.positive': 'Discount value must be greater than zero.',
  }),
  max_discount_amount: Joi.number().positive().optional().allow(null),
  min_order_amount: Joi.number().min(0).optional().allow(null),
  max_uses: Joi.number().integer().positive().optional().allow(null),
  max_uses_per_user: Joi.number().integer().positive().optional().allow(null),
  starts_at: Joi.date().iso().optional().allow(null),
  expires_at: Joi.date().iso().optional().allow(null).messages({
    'date.greater': 'Expiry date must be after the start date.',
  }),
  is_active: Joi.boolean().optional(),
  description: Joi.string().max(255).optional().allow(null, ''),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

module.exports = {
  validatePromoCode,
  validateCreatePromo,
  validateUpdatePromo,
};
