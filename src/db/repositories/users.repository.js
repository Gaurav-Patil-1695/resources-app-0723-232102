const db = require('../knex');

const TABLE = 'users';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByEmail = (email) =>
  db(TABLE).where({ email }).first();

const findByPhone = (phone) =>
  db(TABLE).where({ phone }).first();

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

const list = ({ limit = 20, offset = 0 } = {}) =>
  db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);

const count = () =>
  db(TABLE).count('id as total').first().then((row) => parseInt(row.total, 10));

const updatePassword = (id, password_hash) =>
  db(TABLE).where({ id }).update({ password_hash }).returning('*').then((rows) => rows[0]);

const setVerified = (id) =>
  db(TABLE).where({ id }).update({ is_verified: true, updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);

module.exports = {
  findById,
  findByEmail,
  findByPhone,
  create,
  update,
  remove,
  list,
  count,
  updatePassword,
  setVerified,
};
