/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders - Total number of orders
 * @property {number} orders_today - Orders placed today
 * @property {number} revenue_total - Total revenue in smallest currency unit
 * @property {number} revenue_today - Revenue today in smallest currency unit
 * @property {number} active_users - Number of active users
 * @property {number} new_users_today - New users registered today
 * @property {number} pending_returns - Number of pending return requests
 * @property {number} low_stock_skus - Number of SKUs with low stock
 * @property {number} total_products - Total number of products
 * @property {number} conversion_rate - Checkout conversion rate as a percentage
 */

/**
 * @typedef {Object} ReportData
 * @property {string} report_type - Type of report (e.g. 'sales', 'inventory', 'users')
 * @property {string} period_start - ISO date string for report period start
 * @property {string} period_end - ISO date string for report period end
 * @property {Array<Record<string, string|number>>} rows - Report data rows
 * @property {string[]} columns - Column names for the report
 * @property {Record<string, number>} summary - Aggregated summary metrics
 * @property {string} generated_at - ISO timestamp when report was generated
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - Unique admin user identifier
 * @property {string} email - Admin email address
 * @property {string} first_name - Admin first name
 * @property {string} last_name - Admin last name
 * @property {'admin'|'staff'} role - Admin role level
 * @property {string[]} permissions - List of permission strings
 * @property {boolean} is_active - Whether admin account is active
 * @property {string|null} last_login_at - ISO timestamp of last login
 * @property {string} created_at - ISO timestamp of account creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export default {};
