const db = require('../knex');

const TABLE = 'stock_reservations';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByOrderId = (order_id) =>
  db(TABLE).where({ order_id }).orderBy('created_at');

const findBySkuId = (sku_id) =>
  db(TABLE).where({ sku_id }).orderBy('created_at');

const findActiveByOrderId = (order_id) =>
  db(TABLE).where({ order_id, status: 'active' }).orderBy('created_at');

const create = (data, trx = db) =>
  trx(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data, trx = db) =>
  trx(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const release = (id, trx = db) =>
  trx(TABLE).where({ id }).update({ status: 'released', released_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const releaseByOrderId = (order_id, trx = db) =>
  trx(TABLE).where({ order_id, status: 'active' }).update({ status: 'released', released_at: db.fn.now() });

const confirm = (id, trx = db) =>
  trx(TABLE).where({ id }).update({ status: 'confirmed', updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

const confirmByOrderId = (order_id, trx = db) =>
  trx(TABLE).where({ order_id, status: 'active' }).update({ status: 'confirmed', updated_at: db.fn.now() });

const remove = (id) =>
  db(TABLE).where({ id }).del();

module.exports = {
  findById,
  findByOrderId,
  findBySkuId,
  findActiveByOrderId,
  create,
  update,
  release,
  releaseByOrderId,
  confirm,
  confirmByOrderId,
  remove,
};
