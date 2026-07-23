'use strict';

const config = require('./index');

/**
 * Rate-limit configuration constants derived from the centralised config.
 *
 * RATE_LIMIT_WINDOW_MS  – Duration of the sliding window in milliseconds.
 * RATE_LIMIT_MAX        – Maximum number of requests allowed per window per IP.
 */
const RATE_LIMIT_WINDOW_MS = config.rateLimit.windowMs;
const RATE_LIMIT_MAX = config.rateLimit.max;

module.exports = {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
};
