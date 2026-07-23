const db = require('../../config/database');

/**
 * Aggregates and returns cross-domain reports.
 * Delegates to domain-level queries for each report segment.
 * @param {object} filters - Optional query filters (e.g., date range, type)
 * @returns {Promise<object>} Aggregated report data
 */
const getReports = async (filters = {}) => {
  const { startDate, endDate } = filters;

  const dateFilter = startDate && endDate
    ? `WHERE created_at BETWEEN $1 AND $2`
    : '';
  const dateParams = startDate && endDate ? [startDate, endDate] : [];

  const [usersResult, ordersResult, rolesResult, pinCodesResult] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total_users FROM users ${dateFilter}`, dateParams),
    db.query(`SELECT COUNT(*) AS total_orders FROM orders ${dateFilter}`, dateParams),
    db.query('SELECT COUNT(*) AS total_roles FROM roles'),
    db.query('SELECT COUNT(*) AS total_serviceable_pin_codes FROM serviceable_pin_codes'),
  ]);

  return {
    totalUsers: parseInt(usersResult.rows[0].total_users, 10),
    totalOrders: parseInt(ordersResult.rows[0].total_orders, 10),
    totalRoles: parseInt(rolesResult.rows[0].total_roles, 10),
    totalServiceablePinCodes: parseInt(pinCodesResult.rows[0].total_serviceable_pin_codes, 10),
    filters: { startDate: startDate || null, endDate: endDate || null },
  };
};

/**
 * Returns all available permissions.
 * @returns {Promise<Array>} List of permissions
 */
const getAllPermissions = async () => {
  const result = await db.query(
    'SELECT id, name, description, created_at, updated_at FROM permissions ORDER BY name ASC'
  );
  return result.rows;
};

/**
 * Returns all roles.
 * @returns {Promise<Array>} List of roles
 */
const getAllRoles = async () => {
  const result = await db.query(
    'SELECT id, name, description, created_at, updated_at FROM roles ORDER BY name ASC'
  );
  return result.rows;
};

/**
 * Creates a new role.
 * @param {object} data - Role data
 * @returns {Promise<object>} Created role
 */
const createRole = async (data) => {
  const { name, description } = data;
  const result = await db.query(
    'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at, updated_at',
    [name, description || null]
  );
  return result.rows[0];
};

/**
 * Returns a role by ID.
 * @param {string|number} roleId
 * @returns {Promise<object>} Role record
 */
const getRoleById = async (roleId) => {
  const result = await db.query(
    'SELECT id, name, description, created_at, updated_at FROM roles WHERE id = $1',
    [roleId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Role not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

/**
 * Updates a role by ID.
 * @param {string|number} roleId
 * @param {object} data - Updated role data
 * @returns {Promise<object>} Updated role
 */
const updateRole = async (roleId, data) => {
  const { name, description } = data;
  const result = await db.query(
    `UPDATE roles
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, description, created_at, updated_at`,
    [name || null, description || null, roleId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Role not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

/**
 * Deletes a role by ID.
 * @param {string|number} roleId
 * @returns {Promise<void>}
 */
const deleteRole = async (roleId) => {
  const result = await db.query(
    'DELETE FROM roles WHERE id = $1 RETURNING id',
    [roleId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Role not found');
    error.status = 404;
    throw error;
  }
};

/**
 * Returns permissions assigned to a role.
 * @param {string|number} roleId
 * @returns {Promise<Array>} List of permissions for the role
 */
const getRolePermissions = async (roleId) => {
  await getRoleById(roleId);
  const result = await db.query(
    `SELECT p.id, p.name, p.description, rp.created_at AS assigned_at
     FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1
     ORDER BY p.name ASC`,
    [roleId]
  );
  return result.rows;
};

/**
 * Assigns a permission to a role.
 * @param {string|number} roleId
 * @param {object} data - Must contain permissionId
 * @returns {Promise<object>} Created role-permission mapping
 */
const addPermissionToRole = async (roleId, data) => {
  const { permissionId } = data;
  await getRoleById(roleId);
  const result = await db.query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)
     ON CONFLICT (role_id, permission_id) DO NOTHING
     RETURNING role_id, permission_id, created_at`,
    [roleId, permissionId]
  );
  return result.rows[0] || { role_id: roleId, permission_id: permissionId };
};

/**
 * Removes a permission from a role.
 * @param {string|number} roleId
 * @param {string|number} permissionId
 * @returns {Promise<void>}
 */
const removePermissionFromRole = async (roleId, permissionId) => {
  await getRoleById(roleId);
  const result = await db.query(
    'DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2 RETURNING role_id',
    [roleId, permissionId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Permission not found for this role');
    error.status = 404;
    throw error;
  }
};

/**
 * Returns all serviceable pin codes.
 * @returns {Promise<Array>} List of serviceable pin codes
 */
const getAllServiceablePinCodes = async () => {
  const result = await db.query(
    'SELECT id, pin_code, city, state, is_active, created_at, updated_at FROM serviceable_pin_codes ORDER BY pin_code ASC'
  );
  return result.rows;
};

/**
 * Creates a new serviceable pin code.
 * @param {object} data - Pin code data
 * @returns {Promise<object>} Created pin code record
 */
const createServiceablePinCode = async (data) => {
  const { pinCode, city, state, isActive = true } = data;
  const result = await db.query(
    `INSERT INTO serviceable_pin_codes (pin_code, city, state, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [pinCode, city || null, state || null, isActive]
  );
  return result.rows[0];
};

/**
 * Updates a serviceable pin code by ID.
 * @param {string|number} pinCodeId
 * @param {object} data - Updated pin code data
 * @returns {Promise<object>} Updated pin code record
 */
const updateServiceablePinCode = async (pinCodeId, data) => {
  const { pinCode, city, state, isActive } = data;
  const result = await db.query(
    `UPDATE serviceable_pin_codes
     SET pin_code   = COALESCE($1, pin_code),
         city       = COALESCE($2, city),
         state      = COALESCE($3, state),
         is_active  = COALESCE($4, is_active),
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [pinCode || null, city || null, state || null, isActive !== undefined ? isActive : null, pinCodeId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Serviceable pin code not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

/**
 * Deletes a serviceable pin code by ID.
 * @param {string|number} pinCodeId
 * @returns {Promise<void>}
 */
const deleteServiceablePinCode = async (pinCodeId) => {
  const result = await db.query(
    'DELETE FROM serviceable_pin_codes WHERE id = $1 RETURNING id',
    [pinCodeId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Serviceable pin code not found');
    error.status = 404;
    throw error;
  }
};

module.exports = {
  getReports,
  getAllPermissions,
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getAllServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
