const db = require('../knex');

const TABLE = 'brands';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findBySlug = (slug) =>
  db(TABLE).where({ slug }).first();

const findByName = (name) =>
  db(TABLE).where({ name }).first();

const list = ({ limit = 50, offset = 0, is_active } = {}) => {
  const query = db(TABLE).orderBy('name').limit(limit).offset(offset);
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

module.exports = {
  findById,
  findBySlug,
  findByName,
  list,
  count,
  create,
  update,
  remove,
};
