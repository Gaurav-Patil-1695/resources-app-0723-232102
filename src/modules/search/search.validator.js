const { query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateSearchQuery = [
  query('q')
    .optional()
    .isString()
    .withMessage('q must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('q must not exceed 500 characters'),

  query('filters')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error();
          }
        } catch {
          throw new Error('filters must be a valid JSON object');
        }
      } else if (typeof value !== 'object') {
        throw new Error('filters must be a valid JSON object');
      }
      return true;
    })
    .withMessage('filters must be a valid JSON object'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),

  query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('size must be an integer between 1 and 100')
    .toInt(),

  handleValidationErrors,
];

const validateSuggestQuery = [
  query('q')
    .notEmpty()
    .withMessage('q is required')
    .isString()
    .withMessage('q must be a string')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('q must be between 1 and 200 characters'),

  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('size must be an integer between 1 and 20')
    .toInt(),

  handleValidationErrors,
];

module.exports = { validateSearchQuery, validateSuggestQuery };
