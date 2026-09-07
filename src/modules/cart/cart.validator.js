const Joi = require('joi');
const { validationError } = require('../../utils/validationError');

/**
 * Validate request body for creating a cart.
 */
const createCartSchema = Joi.object({
  guestId: Joi.string().uuid().optional().allow(null, ''),
});

/**
 * Validate request body for adding an item to the cart.
 */
const addItemSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.base': 'productId must be a string.',
    'string.guid': 'productId must be a valid UUID.',
    'any.required': 'productId is required.',
  }),
  variantId: Joi.string().uuid().optional().allow(null, '').messages({
    'string.guid': 'variantId must be a valid UUID.',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'quantity must be a number.',
    'number.integer': 'quantity must be an integer.',
    'number.min': 'quantity must be at least 1.',
    'any.required': 'quantity is required.',
  }),
});

/**
 * Validate request body for updating a cart item.
 */
const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'quantity must be a number.',
    'number.integer': 'quantity must be an integer.',
    'number.min': 'quantity must be 0 or greater.',
    'any.required': 'quantity is required.',
  }),
});

/**
 * Validate request body for applying a promo code.
 */
const applyPromoSchema = Joi.object({
  promoCode: Joi.string().trim().min(1).max(50).required().messages({
    'string.base': 'promoCode must be a string.',
    'string.empty': 'promoCode is required.',
    'string.min': 'promoCode must be at least 1 character.',
    'string.max': 'promoCode must not exceed 50 characters.',
    'any.required': 'promoCode is required.',
  }),
});

/**
 * Middleware factory: validate req.body against a Joi schema.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(422).json({
        error: 'Validation failed.',
        messages,
      });
    }
    req.body = value;
    next();
  };
}

const validateCreateCart = validate(createCartSchema);
const validateAddItem = validate(addItemSchema);
const validateUpdateItem = validate(updateItemSchema);
const validateApplyPromo = validate(applyPromoSchema);

module.exports = {
  validateCreateCart,
  validateAddItem,
  validateUpdateItem,
  validateApplyPromo,
  createCartSchema,
  addItemSchema,
  updateItemSchema,
  applyPromoSchema,
};
