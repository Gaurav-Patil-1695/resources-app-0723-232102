const db = require('../knex');

const TABLE = 'return_requests';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByOrderId = (order_id) =>
  db(TABLE).where({ order_id }).orderBy('created_at', 'desc');

const findByUserId = (user_id, { limit = 20, offset = 0 } = {}) =>
  db(TABLE).where({ user_id }).orderBy('created_at', 'desc').limit(limit).offset(offset);

const list = ({ limit = 20, offset = 0, status } = {}) => {
  const query = db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) query.where({ status });
  return query;
};

const count = (filters = {}) =>
  db(TABLE).where(filters).count('id as total').first().then((row) => parseInt(row.total, 10));

const create = (data, trx = db) =>
  trx(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data, trx = db) =>
  trx(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const updateStatus = (id, status, extra = {}, trx = db) =>
  trx(TABLE).where({ id }).update({ status, ...extra, updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

module.exports = {
  findById,
  findByOrderId,
  findByUserId,
  list,
  count,
  create,
  update,
  updateStatus,
  remove,
};
