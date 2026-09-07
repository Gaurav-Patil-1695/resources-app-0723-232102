const db = require('../knex');

const ROLES_TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

// Roles
const findRoleById = (id) =>
  db(ROLES_TABLE).where({ id }).first();

const findRoleByName = (name) =>
  db(ROLES_TABLE).where({ name }).first();

const listRoles = () =>
  db(ROLES_TABLE).orderBy('name');

const createRole = (data) =>
  db(ROLES_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const updateRole = (id, data) =>
  db(ROLES_TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const deleteRole = (id) =>
  db(ROLES_TABLE).where({ id }).del();

// User Roles
const assignRoleToUser = (user_id, role_id) =>
  db(USER_ROLES_TABLE).insert({ user_id, role_id }).onConflict(['user_id', 'role_id']).ignore();

const removeRoleFromUser = (user_id, role_id) =>
  db(USER_ROLES_TABLE).where({ user_id, role_id }).del();

const getRolesForUser = (user_id) =>
  db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${USER_ROLES_TABLE}.role_id`, '=', `${ROLES_TABLE}.id`)
    .where({ [`${USER_ROLES_TABLE}.user_id`]: user_id })
    .select(`${ROLES_TABLE}.*`);

const getUsersForRole = (role_id) =>
  db(USER_ROLES_TABLE)
    .join('users', `${USER_ROLES_TABLE}.user_id`, '=', 'users.id')
    .where({ [`${USER_ROLES_TABLE}.role_id`]: role_id })
    .select('users.*');

const removeAllRolesFromUser = (user_id) =>
  db(USER_ROLES_TABLE).where({ user_id }).del();

module.exports = {
  findRoleById,
  findRoleByName,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
  getRolesForUser,
  getUsersForRole,
  removeAllRolesFromUser,
};
