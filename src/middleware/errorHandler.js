'use strict';

const logger = require('./requestLogger').logger;

/**
 * Centralised Express error handler.
 * Must be registered AFTER all routes:
 *   app.use(errorHandler);
 *
 * Produces structured JSON error responses.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const error = err.error || httpStatusText(status);
  const message = err.message || 'An unexpected error occurred.';

  // Log server errors
  if (status >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });
  } else {
    logger.warn({
      message: err.message,
      method: req.method,
      url: req.originalUrl,
      status,
    });
  }

  return res.status(status).json({
    status,
    error,
    message,
    ...(process.env.NODE_ENV === 'development' && err.stack
      ? { stack: err.stack }
      : {}),
  });
}

function httpStatusText(code) {
  const map = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return map[code] || 'Error';
}

module.exports = errorHandler;
