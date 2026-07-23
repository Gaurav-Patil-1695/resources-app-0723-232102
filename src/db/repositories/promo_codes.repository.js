const db = require('../knex');

const TABLE = 'promo_codes';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByCode = (code) =>
  db(TABLE).where({ code }).first();

const list = ({ limit = 50, offset = 0, is_active } = {}) => {
  const query = db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (is_active !== undefined) query.where({ is_active });
  return query;
};

const count = (filters = {}) =>
  db(TABLE).where(filters).count('id as total').first().then((row) => parseInt(row.total, 10));

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

/**
 * Atomically increment usage_count if below max_usage (or max_usage is null).
 * Returns updated row or null if limit reached.
 */
const incrementUsage = async (id, trx = db) => {
  const rows = await trx(TABLE)
    .where({ id })
    .where((qb) => qb.whereNull('max_usage').orWhereRaw('usage_count < max_usage'))
    .increment('usage_count', 1)
    .returning('*');
  return rows.length ? rows[0] : null;
};

const decrementUsage = async (id, trx = db) => {
  const rows = await trx(TABLE)
    .where({ id })
    .where('usage_count', '>', 0)
    .decrement('usage_count', 1)
    .returning('*');
  return rows.length ? rows[0] : null;
};

module.exports = {
  findById,
  findByCode,
  list,
  count,
  create,
  update,
  remove,
  incrementUsage,
  decrementUsage,
};
