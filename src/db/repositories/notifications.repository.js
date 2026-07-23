const db = require('../knex');

const TABLE = 'notifications';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByUserId = (user_id, { limit = 20, offset = 0 } = {}) =>
  db(TABLE).where({ user_id }).orderBy('created_at', 'desc').limit(limit).offset(offset);

const findUnreadByUserId = (user_id) =>
  db(TABLE).where({ user_id, is_read: false }).orderBy('created_at', 'desc');

const countUnreadByUserId = (user_id) =>
  db(TABLE).where({ user_id, is_read: false }).count('id as total').first().then((row) => parseInt(row.total, 10));

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const bulkCreate = (records) =>
  db(TABLE).insert(records).returning('*');

const markAsRead = (id) =>
  db(TABLE).where({ id }).update({ is_read: true, read_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const markAllAsRead = (user_id) =>
  db(TABLE).where({ user_id, is_read: false }).update({ is_read: true, read_at: db.fn.now() });

const remove = (id) =>
  db(TABLE).where({ id }).del();

const removeAllByUserId = (user_id) =>
  db(TABLE).where({ user_id }).del();

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

module.exports = {
  findById,
  findByUserId,
  findUnreadByUserId,
  countUnreadByUserId,
  create,
  bulkCreate,
  markAsRead,
  markAllAsRead,
  remove,
  removeAllByUserId,
  update,
};
