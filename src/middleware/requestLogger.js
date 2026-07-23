'use strict';

const morgan = require('morgan');
const winston = require('winston');

/**
 * Winston logger instance.
 * Exported so other middleware (e.g. errorHandler) can reuse it.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

/**
 * Morgan stream that writes to the Winston logger.
 */
const morganStream = {
  write(message) {
    logger.http(message.trim());
  },
};

/**
 * Morgan HTTP request logger middleware.
 * Uses the 'combined' format in production, 'dev' otherwise.
 */
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream: morganStream }
);

module.exports = requestLogger;
module.exports.logger = logger;
