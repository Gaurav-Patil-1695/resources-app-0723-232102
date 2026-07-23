const usersService = require('./users.service');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * GET /users/me
 * Returns the authenticated user's profile.
 */
async function getMe(req, res, next) {
  try {
    const user = await usersService.getUserById(req.user.id);
    return res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me
 * Updates the authenticated user's profile.
 */
async function updateMe(req, res, next) {
  try {
    const updated = await usersService.updateUser(req.user.id, req.body);
    return res.status(200).json(successResponse(updated));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /users/me/change-password
 * Changes the authenticated user's password.
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await usersService.changePassword(req.user.id, currentPassword, newPassword);
    return res.status(200).json(successResponse({ message: 'Password changed successfully.' }));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users
 * Admin: lists all users with optional pagination/filtering.
 */
async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await usersService.listUsers({ page: parseInt(page, 10), limit: parseInt(limit, 10), search });
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:userId
 * Admin: gets a single user by ID.
 */
async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.userId);
    return res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/:userId
 * Admin: updates a user by ID (including role assignment).
 */
async function updateUserById(req, res, next) {
  try {
    const updated = await usersService.adminUpdateUser(req.params.userId, req.body);
    return res.status(200).json(successResponse(updated));
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /users/:userId
 * Admin: deletes a user by ID.
 */
async function deleteUserById(req, res, next) {
  try {
    await usersService.deleteUser(req.params.userId);
    return res.status(200).json(successResponse({ message: 'User deleted successfully.' }));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
