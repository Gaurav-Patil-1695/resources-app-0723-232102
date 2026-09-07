const { body, query, validationResult } = require('express-validator');
const { AppError } = require('../../utils/AppError');

// ---------------------------------------------------------------------------
// Reusable middleware to collect and throw validation errors
// ---------------------------------------------------------------------------

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0];
    return next(new AppError(firstError.msg, 422));
  }
  next();
};

// ---------------------------------------------------------------------------
// Address sub-schema (reusable)
// ---------------------------------------------------------------------------

const addressFieldRules = (prefix, label) => [
  body(`${prefix}.firstName`)
    .notEmpty()
    .withMessage(`${label}: First name is required.`)
    .isLength({ max: 100 })
    .withMessage(`${label}: First name must not exceed 100 characters.`),

  body(`${prefix}.lastName`)
    .notEmpty()
    .withMessage(`${label}: Last name is required.`)
    .isLength({ max: 100 })
    .withMessage(`${label}: Last name must not exceed 100 characters.`),

  body(`${prefix}.addressLine1`)
    .notEmpty()
    .withMessage(`${label}: Address line 1 is required.`)
    .isLength({ max: 255 })
    .withMessage(`${label}: Address line 1 must not exceed 255 characters.`),

  body(`${prefix}.addressLine2`)
    .optional()
    .isLength({ max: 255 })
    .withMessage(`${label}: Address line 2 must not exceed 255 characters.`),

  body(`${prefix}.city`)
    .notEmpty()
    .withMessage(`${label}: City is required.`)
    .isLength({ max: 100 })
    .withMessage(`${label}: City must not exceed 100 characters.`),

  body(`${prefix}.state`)
    .notEmpty()
    .withMessage(`${label}: State / province is required.`)
    .isLength({ max: 100 })
    .withMessage(`${label}: State / province must not exceed 100 characters.`),

  body(`${prefix}.postalCode`)
    .notEmpty()
    .withMessage(`${label}: Postal code is required.`)
    .matches(/^[A-Za-z0-9\s\-]{3,10}$/)
    .withMessage(`${label}: Please enter a valid postal code.`),

  body(`${prefix}.country`)
    .notEmpty()
    .withMessage(`${label}: Country is required.`)
    .isLength({ min: 2, max: 2 })
    .withMessage(`${label}: Country must be a valid 2-letter ISO country code.`),

  body(`${prefix}.phone`)
    .optional()
    .isMobilePhone('any')
    .withMessage(`${label}: Please enter a valid phone number.`),
];

// ---------------------------------------------------------------------------
// POST /checkout/start
// ---------------------------------------------------------------------------

const validateCheckoutStart = [
  body('cartId')
    .optional()
    .isString()
    .withMessage('Cart ID must be a string.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  body('promoCode')
    .optional()
    .isString()
    .withMessage('Promo code must be a string.')
    .isLength({ max: 50 })
    .withMessage('Promo code must not exceed 50 characters.')
    .trim(),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// POST /checkout/address
// ---------------------------------------------------------------------------

const validateCheckoutAddress = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('Checkout session ID is required.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  body('useSameAddress')
    .optional()
    .isBoolean()
    .withMessage('useSameAddress must be a boolean value.'),

  ...addressFieldRules('shippingAddress', 'Shipping address'),

  // Billing address only required when useSameAddress is explicitly false
  body('billingAddress')
    .if(body('useSameAddress').equals('false'))
    .notEmpty()
    .withMessage('Billing address is required when it differs from the shipping address.'),

  ...addressFieldRules('billingAddress', 'Billing address').map((rule) =>
    rule.if(body('useSameAddress').not().equals(true))
  ),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// POST /checkout/place-order
// ---------------------------------------------------------------------------

const validatePlaceOrder = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('Checkout session ID is required.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required.')
    .isIn(['card', 'paypal', 'bank_transfer', 'wallet'])
    .withMessage('Payment method must be one of: card, paypal, bank_transfer, wallet.'),

  body('paymentDetails')
    .optional()
    .isObject()
    .withMessage('Payment details must be an object.'),

  body('agreedToTerms')
    .notEmpty()
    .withMessage('You must agree to the terms and conditions to place an order.')
    .isBoolean()
    .withMessage('agreedToTerms must be a boolean value.')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must agree to the terms and conditions to place an order.');
      }
      return true;
    }),

  handleValidationErrors,
];

module.exports = {
  validateCheckoutStart,
  validateCheckoutAddress,
  validatePlaceOrder,
};
