const db = require('../../database/db');
const bcrypt = require('bcrypt');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../../utils/errors');

const SALT_ROUNDS = 12;

/**
 * Fetches a user by ID. Throws NotFoundError if not found.
 */
async function getUserById(userId) {
  const result = await db.query(
    `SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
}

/**
 * Updates a user's own profile fields (first_name, last_name, email).
 */
async function updateUser(userId, payload) {
  const { firstName, lastName, email } = payload;

  if (email) {
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2 AND deleted_at IS NULL',
      [email, userId]
    );
    if (existing.rows.length > 0) {
      throw new ConflictError('Email address is already in use.');
    }
  }

  const result = await db.query(
    `UPDATE users
     SET
       first_name  = COALESCE($1, first_name),
       last_name   = COALESCE($2, last_name),
       email       = COALESCE($3, email),
       updated_at  = NOW()
     WHERE id = $4 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, role, is_active, created_at, updated_at`,
    [firstName || null, lastName || null, email || null, userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }

  return result.rows[0];
}

/**
 * Changes the authenticated user's password after verifying the current password.
 */
async function changePassword(userId, currentPassword, newPassword) {
  const result = await db.query(
    'SELECT id, password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

  if (!passwordMatch) {
    throw new UnauthorizedError('Current password is incorrect.');
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId]
  );
}

/**
 * Lists users with pagination and optional search.
 */
async function listUsers({ page, limit, search }) {
  const offset = (page - 1) * limit;
  const params = [];
  let whereClause = 'WHERE deleted_at IS NULL';

  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND (first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length})`;
  }

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const dataResult = await db.query(
    `SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );

  const countParams = search ? [`%${search}%`] : [];
  const countResult = await db.query(
    `SELECT COUNT(*) AS total FROM users ${whereClause.replace(`$${limitIdx}`, '').replace(`$${offsetIdx}`, '')}`,
    countParams
  );

  return {
    data: dataResult.rows,
    total: parseInt(countResult.rows[0].total, 10),
    page,
    limit,
  };
}

/**
 * Admin update: allows updating role and is_active in addition to profile fields.
 */
async function adminUpdateUser(userId, payload) {
  const { firstName, lastName, email, role, isActive } = payload;

  if (email) {
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2 AND deleted_at IS NULL',
      [email, userId]
    );
    if (existing.rows.length > 0) {
      throw new ConflictError('Email address is already in use.');
    }
  }

  const result = await db.query(
    `UPDATE users
     SET
       first_name  = COALESCE($1, first_name),
       last_name   = COALESCE($2, last_name),
       email       = COALESCE($3, email),
       role        = COALESCE($4, role),
       is_active   = COALESCE($5, is_active),
       updated_at  = NOW()
     WHERE id = $6 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, role, is_active, created_at, updated_at`,
    [
      firstName || null,
      lastName || null,
      email || null,
      role || null,
      isActive !== undefined ? isActive : null,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }

  return result.rows[0];
}

/**
 * Soft-deletes a user by setting deleted_at.
 */
async function deleteUser(userId) {
  const result = await db.query(
    `UPDATE users
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
}

module.exports = {
  getUserById,
  updateUser,
  changePassword,
  listUsers,
  adminUpdateUser,
  deleteUser,
};
