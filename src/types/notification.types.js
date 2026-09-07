/**
 * @typedef {'order'|'payment'|'return'|'promotion'|'system'} NotificationType
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification identifier
 * @property {string} user_id - Associated user identifier
 * @property {NotificationType} type - Category of notification
 * @property {string} title - Notification title
 * @property {string} message - Notification message body
 * @property {boolean} is_read - Whether notification has been read
 * @property {string|null} action_url - Optional URL for notification action
 * @property {string|null} reference_id - Optional reference entity identifier (e.g. order_id)
 * @property {string|null} reference_type - Optional reference entity type (e.g. 'order')
 * @property {string} created_at - ISO timestamp of notification creation
 * @property {string|null} read_at - ISO timestamp when notification was read
 */

export default {};
