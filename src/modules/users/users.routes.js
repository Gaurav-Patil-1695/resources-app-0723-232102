const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const usersValidator = require('./users.validator');
const { authenticate, requireRole } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');

// Authenticated user routes
router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validate(usersValidator.updateProfile), usersController.updateMe);
router.post('/me/change-password', authenticate, validate(usersValidator.changePassword), usersController.changePassword);

// Admin user management routes
router.get('/', authenticate, requireRole('admin'), usersController.listUsers);
router.get('/:userId', authenticate, requireRole('admin'), usersController.getUserById);
router.patch('/:userId', authenticate, requireRole('admin'), validate(usersValidator.adminUpdateUser), usersController.updateUserById);
router.delete('/:userId', authenticate, requireRole('admin'), usersController.deleteUserById);

module.exports = router;
