const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const createAddressRules = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters.'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required.')
    .isLength({ max: 255 })
    .withMessage('Address line 1 must not exceed 255 characters.'),

  body('address_line2')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address line 2 must not exceed 255 characters.'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required.')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters.'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required.')
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters.'),

  body('pin_code')
    .trim()
    .notEmpty()
    .withMessage('PIN code is required.')
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be a valid 6-digit number.'),

  body('country')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters.'),

  body('is_default')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('is_default must be a boolean value.'),

  body('address_type')
    .optional({ nullable: true })
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('Address type must be one of: home, work, other.'),
];

const updateAddressRules = [
  body('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters.'),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number must not be empty.')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address line 1 must not be empty.')
    .isLength({ max: 255 })
    .withMessage('Address line 1 must not exceed 255 characters.'),

  body('address_line2')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address line 2 must not exceed 255 characters.'),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City must not be empty.')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters.'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State must not be empty.')
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters.'),

  body('pin_code')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('PIN code must not be empty.')
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be a valid 6-digit number.'),

  body('country')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters.'),

  body('is_default')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('is_default must be a boolean value.'),

  body('address_type')
    .optional({ nullable: true })
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('Address type must be one of: home, work, other.'),
];

const validateCreateAddress = [...createAddressRules, handleValidationErrors];
const validateUpdateAddress = [...updateAddressRules, handleValidationErrors];

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
