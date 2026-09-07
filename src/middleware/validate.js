'use strict';

/**
 * Generic Joi validation middleware factory.
 *
 * @param {import('joi').Schema} schema - A Joi schema to validate against.
 * @param {'body'|'query'|'params'} [source='body'] - The request property to validate.
 * @returns {Function} Express middleware
 *
 * Example usage:
 *   router.post('/users', validate(createUserSchema), createUser);
 *   router.get('/users', validate(listQuerySchema, 'query'), listUsers);
 */
function validate(schema, source = 'body') {
  return function validationMiddleware(req, res, next) {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Validation failed.',
        details,
      });
    }

    // Replace the request property with the sanitised value
    req[source] = value;
    return next();
  };
}

module.exports = validate;
