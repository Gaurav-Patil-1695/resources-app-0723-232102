const rolesService = require('./roles.service');

/**
 * GET /roles
 * Returns all roles.
 */
async function getAllRoles(req, res, next) {
  try {
    const roles = await rolesService.getAllRoles();
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /roles/:id
 * Returns a single role by id.
 */
async function getRoleById(req, res, next) {
  try {
    const role = await rolesService.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /roles
 * Creates a new role.
 */
async function createRole(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Role name is required.' });
    }
    const role = await rolesService.createRole({ name, description });
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /roles/:id
 * Updates an existing role.
 */
async function updateRole(req, res, next) {
  try {
    const { name, description } = req.body;
    const role = await rolesService.updateRole(req.params.id, { name, description });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /roles/:id
 * Deletes a role by id.
 */
async function deleteRole(req, res, next) {
  try {
    const deleted = await rolesService.deleteRole(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    res.status(200).json({ success: true, message: 'Role deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /roles/:id/users
 * Returns all users assigned to a role.
 */
async function getUsersByRole(req, res, next) {
  try {
    const users = await rolesService.getUsersByRole(req.params.id);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /roles/assign
 * Assigns a role to a user.
 * Body: { userId, roleId }
 */
async function assignRoleToUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
      return res.status(400).json({ success: false, message: 'userId and roleId are required.' });
    }
    const assignment = await rolesService.assignRoleToUser({ userId, roleId });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /roles/assign
 * Removes a role from a user.
 * Body: { userId, roleId }
 */
async function removeRoleFromUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
      return res.status(400).json({ success: false, message: 'userId and roleId are required.' });
    }
    const removed = await rolesService.removeRoleFromUser({ userId, roleId });
    if (!removed) {
      return res.status(404).json({ success: false, message: 'User-role assignment not found.' });
    }
    res.status(200).json({ success: true, message: 'Role removed from user successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /roles/user/:userId
 * Returns all roles assigned to a user.
 */
async function getRolesByUser(req, res, next) {
  try {
    const roles = await rolesService.getRolesByUser(req.params.userId);
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getUsersByRole,
  assignRoleToUser,
  removeRoleFromUser,
  getRolesByUser,
};
