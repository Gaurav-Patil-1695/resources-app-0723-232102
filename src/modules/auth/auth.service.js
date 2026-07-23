const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../../config/db');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const RESET_TOKEN_EXPIRES_MINUTES = 60;

const tokenBlacklist = new Set();

const register = async ({ email, password, name }) => {
  const existing = await db('users').where({ email }).first();
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [userId] = await db('users').insert({
    email,
    password_hash: passwordHash,
    name: name || null,
    is_guest: false,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });
  const user = await db('users').where({ id: userId }).first();
  const token = issueToken(user);
  return { token, user: sanitizeUser(user) };
};

const login = async ({ email, password }) => {
  const user = await db('users').where({ email, is_guest: false }).first();
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const token = issueToken(user);
  return { token, user: sanitizeUser(user) };
};

const logout = async (token) => {
  if (token) {
    tokenBlacklist.add(token);
  }
};

const forgotPassword = async (email) => {
  const user = await db('users').where({ email }).first();
  if (!user) {
    return;
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);
  await db('users').where({ id: user.id }).update({
    reset_token_hash: resetTokenHash,
    reset_token_expires_at: expiresAt,
    updated_at: db.fn.now(),
  });
  // In a real implementation, send the resetToken via email here.
};

const resetPassword = async ({ token, email, password }) => {
  const user = await db('users').where({ email }).first();
  if (!user || !user.reset_token_hash || !user.reset_token_expires_at) {
    const err = new Error('Invalid or expired password reset token.');
    err.status = 400;
    throw err;
  }
  if (new Date() > new Date(user.reset_token_expires_at)) {
    const err = new Error('Invalid or expired password reset token.');
    err.status = 400;
    throw err;
  }
  const valid = await bcrypt.compare(token, user.reset_token_hash);
  if (!valid) {
    const err = new Error('Invalid or expired password reset token.');
    err.status = 400;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await db('users').where({ id: user.id }).update({
    password_hash: passwordHash,
    reset_token_hash: null,
    reset_token_expires_at: null,
    updated_at: db.fn.now(),
  });
};

const guestRegister = async ({ name }) => {
  const guestEmail = `guest_${crypto.randomBytes(8).toString('hex')}@guest.local`;
  const guestPassword = crypto.randomBytes(16).toString('hex');
  const passwordHash = await bcrypt.hash(guestPassword, SALT_ROUNDS);
  const [userId] = await db('users').insert({
    email: guestEmail,
    password_hash: passwordHash,
    name: name || null,
    is_guest: true,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });
  const user = await db('users').where({ id: userId }).first();
  const token = issueToken(user);
  return { token, user: sanitizeUser(user) };
};

const issueToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, isGuest: user.is_guest },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const sanitizeUser = (user) => {
  const { password_hash, reset_token_hash, reset_token_expires_at, ...safe } = user;
  return safe;
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
};
