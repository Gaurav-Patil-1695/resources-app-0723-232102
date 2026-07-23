/**
 * @typedef {Object} Address
 * @property {string} id - Unique address identifier
 * @property {string} user_id - Associated user identifier
 * @property {string} full_name - Recipient full name
 * @property {string} phone - Recipient phone number
 * @property {string} line1 - Address line 1
 * @property {string|null} line2 - Address line 2
 * @property {string} city - City name
 * @property {string} state - State name
 * @property {string} country - Country name
 * @property {string} pin_code - Postal/PIN code
 * @property {boolean} is_serviceable - Whether delivery is available at this address
 * @property {boolean} is_default - Whether this is the user's default address
 * @property {'home'|'work'|'other'} address_type - Type of address
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

export default {};
