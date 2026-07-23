const Joi = require('joi');

/**
 * Middleware factory — validates req.body against a Joi schema.
 * @param {Joi.ObjectSchema} schema
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.details.map((d) => d.message),
      });
    }
    req.body = value;
    return next();
  };
}

/**
 * Schema: POST /payments/initiate
 */
const initiatePaymentSchema = Joi.object({
  orderId: Joi.string().trim().required().messages({
    'string.base': 'orderId must be a string.',
    'string.empty': 'orderId is required.',
    'any.required': 'orderId is required.',
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'amount must be a number.',
    'number.positive': 'amount must be a positive number.',
    'any.required': 'amount is required.',
  }),
  currency: Joi.string().trim().uppercase().length(3).required().messages({
    'string.base': 'currency must be a string.',
    'string.empty': 'currency is required.',
    'string.length': 'currency must be a valid 3-letter ISO code.',
    'any.required': 'currency is required.',
  }),
  provider: Joi.string().trim().required().messages({
    'string.base': 'provider must be a string.',
    'string.empty': 'provider is required.',
    'any.required': 'provider is required.',
  }),
  metadata: Joi.object().optional(),
});

/**
 * Schema: POST /payments/callback
 */
const callbackSchema = Joi.object({
  provider: Joi.string().trim().required().messages({
    'string.base': 'provider must be a string.',
    'string.empty': 'provider is required.',
    'any.required': 'provider is required.',
  }),
  paymentId: Joi.string().trim().required().messages({
    'string.base': 'paymentId must be a string.',
    'string.empty': 'paymentId is required.',
    'any.required': 'paymentId is required.',
  }),
  status: Joi.string().trim().required().messages({
    'string.base': 'status must be a string.',
    'string.empty': 'status is required.',
    'any.required': 'status is required.',
  }),
  reference: Joi.string().trim().optional(),
}).unknown(true); // allow extra provider-specific fields

/**
 * Schema: POST /payments/:paymentId/retry
 */
const retryPaymentSchema = Joi.object({
  provider: Joi.string().trim().optional().messages({
    'string.base': 'provider must be a string.',
  }),
  metadata: Joi.object().optional(),
});

const validateInitiatePayment = validate(initiatePaymentSchema);
const validateCallback = validate(callbackSchema);
const validateRetry = validate(retryPaymentSchema);

module.exports = {
  validateInitiatePayment,
  validateCallback,
  validateRetry,
};
