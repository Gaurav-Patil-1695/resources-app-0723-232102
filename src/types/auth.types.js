/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} first_name - User first name
 * @property {string} last_name - User last name
 * @property {string} phone - User phone number
 * @property {'customer'|'admin'|'staff'} role - User role
 * @property {boolean} is_active - Whether user account is active
 * @property {boolean} is_verified - Whether user email is verified
 * @property {string|null} avatar_url - URL to user avatar image
 * @property {string} created_at - ISO timestamp of account creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email - User email address
 * @property {string} password - User password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} email - User email address
 * @property {string} password - User password
 * @property {string} first_name - User first name
 * @property {string} last_name - User last name
 * @property {string} phone - User phone number
 */

/**
 * @typedef {Object} ResetPayload
 * @property {string} token - Password reset token
 * @property {string} new_password - New password to set
 * @property {string} confirm_password - Confirmation of new password
 */

export default {};
