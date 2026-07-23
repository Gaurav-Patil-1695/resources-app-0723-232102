const { body, param, validationResult } = require('express-validator');

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

/**
 * Middleware to collect and return validation errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array(),
    });
  }
  next();
}

/**
 * Validate payload for POST /orders/:orderId/advance
 */
const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),

  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}.`),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Note must not exceed 1000 characters.'),

  handleValidationErrors,
];

/**
 * Validate payload for POST /orders/:orderId/cancel
 */
const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),

  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Reason must not exceed 1000 characters.'),

  handleValidationErrors,
];

/**
 * Validate payload for POST /orders/:orderId/return-requests
 */
const validateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required.'),

  body('reason')
    .notEmpty()
    .withMessage('Reason is required.')
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Reason must not exceed 1000 characters.'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array.'),

  body('items.*.productId')
    .optional()
    .notEmpty()
    .withMessage('Each item must have a valid product ID.'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a positive integer.'),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Note must not exceed 1000 characters.'),

  handleValidationErrors,
];

module.exports = {
  validateAdvanceOrder,
  validateCancelOrder,
  validateReturnRequest,
};
