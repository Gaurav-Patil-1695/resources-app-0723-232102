/**
 * In-memory stores for roles and user_roles.
 * Replace these with database calls (e.g. via a repository/ORM) as required.
 */
let roles = [];
let userRoles = [];
let roleIdCounter = 1;
let userRoleIdCounter = 1;

/**
 * Retrieve all roles.
 * @returns {Promise<Array>}
 */
async function getAllRoles() {
  return roles.slice();
}

/**
 * Retrieve a role by its id.
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
async function getRoleById(id) {
  const role = roles.find((r) => r.id === Number(id));
  return role || null;
}

/**
 * Create a new role.
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} [payload.description]
 * @returns {Promise<Object>}
 */
async function createRole({ name, description = '' }) {
  const existingRole = roles.find((r) => r.name === name);
  if (existingRole) {
    const err = new Error('A role with that name already exists.');
    err.status = 409;
    throw err;
  }
  const role = {
    id: roleIdCounter++,
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  roles.push(role);
  return role;
}

/**
 * Update an existing role.
 * @param {string|number} id
 * @param {Object} payload
 * @param {string} [payload.name]
 * @param {string} [payload.description]
 * @returns {Promise<Object|null>}
 */
async function updateRole(id, { name, description }) {
  const index = roles.findIndex((r) => r.id === Number(id));
  if (index === -1) {
    return null;
  }
  if (name && name !== roles[index].name) {
    const duplicate = roles.find((r) => r.name === name && r.id !== Number(id));
    if (duplicate) {
      const err = new Error('A role with that name already exists.');
      err.status = 409;
      throw err;
    }
  }
  const updatedRole = {
    ...roles[index],
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    updatedAt: new Date().toISOString(),
  };
  roles[index] = updatedRole;
  return updatedRole;
}

/**
 * Delete a role by its id.
 * Also removes any user_roles associations for this role.
 * @param {string|number} id
 * @returns {Promise<boolean>}
 */
async function deleteRole(id) {
  const index = roles.findIndex((r) => r.id === Number(id));
  if (index === -1) {
    return false;
  }
  roles.splice(index, 1);
  userRoles = userRoles.filter((ur) => ur.roleId !== Number(id));
  return true;
}

/**
 * Get all users assigned to a specific role.
 * @param {string|number} roleId
 * @returns {Promise<Array>}
 */
async function getUsersByRole(roleId) {
  const assignments = userRoles.filter((ur) => ur.roleId === Number(roleId));
  return assignments.map((ur) => ({ userId: ur.userId, roleId: ur.roleId, assignedAt: ur.assignedAt }));
}

/**
 * Assign a role to a user.
 * @param {Object} payload
 * @param {string|number} payload.userId
 * @param {string|number} payload.roleId
 * @returns {Promise<Object>}
 */
async function assignRoleToUser({ userId, roleId }) {
  const roleExists = roles.find((r) => r.id === Number(roleId));
  if (!roleExists) {
    const err = new Error('Role not found.');
    err.status = 404;
    throw err;
  }
  const existing = userRoles.find(
    (ur) => ur.userId === Number(userId) && ur.roleId === Number(roleId)
  );
  if (existing) {
    const err = new Error('User already has this role assigned.');
    err.status = 409;
    throw err;
  }
  const assignment = {
    id: userRoleIdCounter++,
    userId: Number(userId),
    roleId: Number(roleId),
    assignedAt: new Date().toISOString(),
  };
  userRoles.push(assignment);
  return assignment;
}

/**
 * Remove a role from a user.
 * @param {Object} payload
 * @param {string|number} payload.userId
 * @param {string|number} payload.roleId
 * @returns {Promise<boolean>}
 */
async function removeRoleFromUser({ userId, roleId }) {
  const index = userRoles.findIndex(
    (ur) => ur.userId === Number(userId) && ur.roleId === Number(roleId)
  );
  if (index === -1) {
    return false;
  }
  userRoles.splice(index, 1);
  return true;
}

/**
 * Get all roles assigned to a specific user.
 * @param {string|number} userId
 * @returns {Promise<Array>}
 */
async function getRolesByUser(userId) {
  const assignments = userRoles.filter((ur) => ur.userId === Number(userId));
  return assignments.map((ur) => {
    const role = roles.find((r) => r.id === ur.roleId);
    return { ...role, assignedAt: ur.assignedAt };
  }).filter(Boolean);
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
