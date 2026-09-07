const db = require('../../db');

/**
 * Create a notification for a user. Intended to be called by other services.
 * @param {object} params
 * @param {number|string} params.userId
 * @param {string} params.type
 * @param {string} params.message
 * @param {object} [params.metadata]
 * @returns {Promise<object>} Created notification
 */
async function createNotification({ userId, type, message, metadata = null }) {
  const [notification] = await db('notifications')
    .insert({
      user_id: userId,
      type,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
      is_read: false,
      created_at: new Date(),
    })
    .returning('*');
  return notification;
}

/**
 * Get paginated notifications for a user.
 * @param {number|string} userId
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {boolean} options.unreadOnly
 * @returns {Promise<object>}
 */
async function getNotificationsForUser(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
  const offset = (page - 1) * limit;

  const query = db('notifications').where({ user_id: userId });

  if (unreadOnly) {
    query.where({ is_read: false });
  }

  const totalQuery = query.clone().count('id as count').first();
  const rowsQuery = query
    .clone()
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [totalResult, rows] = await Promise.all([totalQuery, rowsQuery]);
  const total = parseInt(totalResult.count, 10);
  const unreadCount = await getUnreadCount(userId);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
}

/**
 * Get a single notification by id, scoped to a user.
 * @param {number|string} notificationId
 * @param {number|string} userId
 * @returns {Promise<object|null>}
 */
async function getNotificationById(notificationId, userId) {
  const notification = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .first();
  return notification || null;
}

/**
 * Get the count of unread notifications for a user.
 * @param {number|string} userId
 * @returns {Promise<number>}
 */
async function getUnreadCount(userId) {
  const result = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .count('id as count')
    .first();
  return parseInt(result.count, 10);
}

/**
 * Mark a single notification as read.
 * @param {number|string} notificationId
 * @param {number|string} userId
 * @returns {Promise<object|null>}
 */
async function markNotificationRead(notificationId, userId) {
  const [notification] = await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .update({ is_read: true, read_at: new Date() })
    .returning('*');
  return notification || null;
}

/**
 * Mark all notifications for a user as read.
 * @param {number|string} userId
 * @returns {Promise<object>}
 */
async function markAllNotificationsRead(userId) {
  const updatedRows = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true, read_at: new Date() })
    .returning('*');
  return { updated: updatedRows.length, data: updatedRows };
}

module.exports = {
  createNotification,
  getNotificationsForUser,
  getNotificationById,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
};
