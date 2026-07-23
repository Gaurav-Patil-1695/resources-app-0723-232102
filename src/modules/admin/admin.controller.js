const adminService = require('./admin.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

/**
 * GET /admin/reports
 * Returns aggregated reports across domains.
 */
const getReports = async (req, res) => {
  try {
    const reports = await adminService.getReports(req.query);
    return sendSuccess(res, 200, 'Reports retrieved successfully', reports);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve reports');
  }
};

/**
 * GET /admin/permissions
 * Returns all available permissions.
 */
const getPermissions = async (req, res) => {
  try {
    const permissions = await adminService.getAllPermissions();
    return sendSuccess(res, 200, 'Permissions retrieved successfully', permissions);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve permissions');
  }
};

/**
 * GET /admin/roles
 * Returns all roles.
 */
const getRoles = async (req, res) => {
  try {
    const roles = await adminService.getAllRoles();
    return sendSuccess(res, 200, 'Roles retrieved successfully', roles);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve roles');
  }
};

/**
 * POST /admin/roles
 * Creates a new role.
 */
const createRole = async (req, res) => {
  try {
    const role = await adminService.createRole(req.body);
    return sendSuccess(res, 201, 'Role created successfully', role);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to create role');
  }
};

/**
 * GET /admin/roles/:roleId
 * Returns a role by ID.
 */
const getRoleById = async (req, res) => {
  try {
    const role = await adminService.getRoleById(req.params.roleId);
    return sendSuccess(res, 200, 'Role retrieved successfully', role);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve role');
  }
};

/**
 * PUT /admin/roles/:roleId
 * Updates a role by ID.
 */
const updateRole = async (req, res) => {
  try {
    const role = await adminService.updateRole(req.params.roleId, req.body);
    return sendSuccess(res, 200, 'Role updated successfully', role);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to update role');
  }
};

/**
 * DELETE /admin/roles/:roleId
 * Deletes a role by ID.
 */
const deleteRole = async (req, res) => {
  try {
    await adminService.deleteRole(req.params.roleId);
    return sendSuccess(res, 200, 'Role deleted successfully', null);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to delete role');
  }
};

/**
 * GET /admin/roles/:roleId/permissions
 * Returns permissions assigned to a role.
 */
const getRolePermissions = async (req, res) => {
  try {
    const permissions = await adminService.getRolePermissions(req.params.roleId);
    return sendSuccess(res, 200, 'Role permissions retrieved successfully', permissions);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve role permissions');
  }
};

/**
 * POST /admin/roles/:roleId/permissions
 * Assigns a permission to a role.
 */
const addPermissionToRole = async (req, res) => {
  try {
    const result = await adminService.addPermissionToRole(req.params.roleId, req.body);
    return sendSuccess(res, 201, 'Permission assigned to role successfully', result);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to assign permission to role');
  }
};

/**
 * DELETE /admin/roles/:roleId/permissions/:permissionId
 * Removes a permission from a role.
 */
const removePermissionFromRole = async (req, res) => {
  try {
    await adminService.removePermissionFromRole(req.params.roleId, req.params.permissionId);
    return sendSuccess(res, 200, 'Permission removed from role successfully', null);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to remove permission from role');
  }
};

/**
 * GET /admin/serviceable-pin-codes
 * Returns all serviceable pin codes.
 */
const getServiceablePinCodes = async (req, res) => {
  try {
    const pinCodes = await adminService.getAllServiceablePinCodes();
    return sendSuccess(res, 200, 'Serviceable pin codes retrieved successfully', pinCodes);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to retrieve serviceable pin codes');
  }
};

/**
 * POST /admin/serviceable-pin-codes
 * Creates a new serviceable pin code.
 */
const createServiceablePinCode = async (req, res) => {
  try {
    const pinCode = await adminService.createServiceablePinCode(req.body);
    return sendSuccess(res, 201, 'Serviceable pin code created successfully', pinCode);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to create serviceable pin code');
  }
};

/**
 * PUT /admin/serviceable-pin-codes/:pinCodeId
 * Updates a serviceable pin code by ID.
 */
const updateServiceablePinCode = async (req, res) => {
  try {
    const pinCode = await adminService.updateServiceablePinCode(req.params.pinCodeId, req.body);
    return sendSuccess(res, 200, 'Serviceable pin code updated successfully', pinCode);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to update serviceable pin code');
  }
};

/**
 * DELETE /admin/serviceable-pin-codes/:pinCodeId
 * Deletes a serviceable pin code by ID.
 */
const deleteServiceablePinCode = async (req, res) => {
  try {
    await adminService.deleteServiceablePinCode(req.params.pinCodeId);
    return sendSuccess(res, 200, 'Serviceable pin code deleted successfully', null);
  } catch (error) {
    return sendError(res, error.status || 500, error.message || 'Failed to delete serviceable pin code');
  }
};

module.exports = {
  getReports,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
