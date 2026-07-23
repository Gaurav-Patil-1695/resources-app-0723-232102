const db = require('../knex');

const TABLE = 'refunds';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByOrderId = (order_id) =>
  db(TABLE).where({ order_id }).orderBy('created_at', 'desc');

const findByPaymentAttemptId = (payment_attempt_id) =>
  db(TABLE).where({ payment_attempt_id }).orderBy('created_at', 'desc');

const findByGatewayRefundId = (gateway_refund_id) =>
  db(TABLE).where({ gateway_refund_id }).first();

const list = ({ limit = 50, offset = 0, status } = {}) => {
  const query = db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) query.where({ status });
  return query;
};

const create = (data, trx = db) =>
  trx(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data, trx = db) =>
  trx(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const updateStatus = (id, status, extra = {}, trx = db) =>
  trx(TABLE).where({ id }).update({ status, ...extra, updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const sumRefundedByOrderId = (order_id) =>
  db(TABLE)
    .where({ order_id, status: 'succeeded' })
    .sum('amount as total')
    .first()
    .then((row) => parseFloat(row.total || 0));

module.exports = {
  findById,
  findByOrderId,
  findByPaymentAttemptId,
  findByGatewayRefundId,
  list,
  create,
  update,
  updateStatus,
  sumRefundedByOrderId,
};
