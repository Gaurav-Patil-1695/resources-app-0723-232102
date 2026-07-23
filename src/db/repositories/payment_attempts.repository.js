const db = require('../knex');

const TABLE = 'payment_attempts';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByOrderId = (order_id) =>
  db(TABLE).where({ order_id }).orderBy('created_at', 'desc');

const findByGatewayReference = (gateway_reference) =>
  db(TABLE).where({ gateway_reference }).first();

const findLatestByOrderId = (order_id) =>
  db(TABLE).where({ order_id }).orderBy('created_at', 'desc').first();

const create = (data, trx = db) =>
  trx(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data, trx = db) =>
  trx(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const updateStatus = (id, status, metadata = {}, trx = db) =>
  trx(TABLE).where({ id }).update({ status, ...metadata, updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const listByStatus = (status, { limit = 50, offset = 0 } = {}) =>
  db(TABLE).where({ status }).orderBy('created_at', 'desc').limit(limit).offset(offset);

module.exports = {
  findById,
  findByOrderId,
  findByGatewayReference,
  findLatestByOrderId,
  create,
  update,
  updateStatus,
  listByStatus,
};
