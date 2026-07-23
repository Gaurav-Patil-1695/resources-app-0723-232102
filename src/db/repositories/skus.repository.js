const db = require('../knex');

const TABLE = 'skus';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findBySku = (sku_code) =>
  db(TABLE).where({ sku_code }).first();

const findByProductId = (product_id) =>
  db(TABLE).where({ product_id }).orderBy('created_at');

const list = ({ limit = 50, offset = 0, product_id, is_active } = {}) => {
  const query = db(TABLE).limit(limit).offset(offset).orderBy('created_at', 'desc');
  if (product_id !== undefined) query.where({ product_id });
  if (is_active !== undefined) query.where({ is_active });
  return query;
};

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

/**
 * Atomically decrement stock_quantity by `qty` only if sufficient stock exists.
 * Returns the updated row or null if insufficient stock.
 */
const decrementStock = async (id, qty, trx = db) => {
  const rows = await trx(TABLE)
    .where('id', id)
    .where('stock_quantity', '>=', qty)
    .decrement('stock_quantity', qty)
    .returning('*');
  return rows.length ? rows[0] : null;
};

/**
 * Atomically increment stock_quantity by `qty`.
 */
const incrementStock = async (id, qty, trx = db) => {
  const rows = await trx(TABLE)
    .where({ id })
    .increment('stock_quantity', qty)
    .returning('*');
  return rows.length ? rows[0] : null;
};

/**
 * Reserve stock: decrement available and track via stock_reservations if needed.
 * This is the low-level atomic step.
 */
const reserveStock = (id, qty, trx = db) =>
  decrementStock(id, qty, trx);

const releaseStock = (id, qty, trx = db) =>
  incrementStock(id, qty, trx);

module.exports = {
  findById,
  findBySku,
  findByProductId,
  list,
  create,
  update,
  remove,
  decrementStock,
  incrementStock,
  reserveStock,
  releaseStock,
};
