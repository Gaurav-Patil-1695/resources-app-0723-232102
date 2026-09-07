/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const config = require('./index');

/**
 * JWT configuration constants derived from the centralised config.
 */
const JWT_SECRET = config.jwt.secret;

/** TTL for short-lived access tokens (e.g. '15m'). */
const JWT_ACCESS_TTL = config.jwt.accessTtl;

/** TTL for password-reset tokens (e.g. '1h'). */
const JWT_RESET_TTL = config.jwt.resetTtl;

module.exports = {
  JWT_SECRET,
  JWT_ACCESS_TTL,
  JWT_RESET_TTL,
};
