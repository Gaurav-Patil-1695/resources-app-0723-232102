const crypto = require('crypto');

const TOKEN_BYTE_LENGTH = 32;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a cryptographically secure reset token.
 *
 * @returns {{ token: string, hashedToken: string, expiresAt: Date }}
 *   token       - Raw hex token to send to the user (never stored)
 *   hashedToken - SHA-256 hex digest to persist in the database
 *   expiresAt   - Expiry timestamp
 */
function generateResetToken() {
  const token = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  return { token, hashedToken, expiresAt };
}

/**
 * Hash a raw token using SHA-256.
 *
 * @param {string} token - Raw hex token
 * @returns {string} SHA-256 hex digest
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a raw token against a stored hash and expiry date.
 *
 * @param {string} token       - Raw hex token supplied by the user
 * @param {string} storedHash  - SHA-256 hex digest stored in the database
 * @param {Date}   expiresAt   - Expiry timestamp stored in the database
 * @returns {boolean} True if the token is valid and not expired
 */
function verifyResetToken(token, storedHash, expiresAt) {
  if (!token || !storedHash || !expiresAt) {
    return false;
  }

  const candidateHash = hashToken(token);
  const hashesMatch = crypto.timingSafeEqual(
    Buffer.from(candidateHash, 'hex'),
    Buffer.from(storedHash, 'hex')
  );

  const notExpired = new Date() < new Date(expiresAt);

  return hashesMatch && notExpired;
}

module.exports = {
  generateResetToken,
  hashToken,
  verifyResetToken,
  TOKEN_BYTE_LENGTH,
  TOKEN_EXPIRY_MS,
};
