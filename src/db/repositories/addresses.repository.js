const db = require('../knex');

const TABLE = 'addresses';

const findById = (id) =>
  db(TABLE).where({ id }).first();

const findByUserId = (user_id) =>
  db(TABLE).where({ user_id }).orderBy('created_at', 'desc');

const findDefaultByUserId = (user_id) =>
  db(TABLE).where({ user_id, is_default: true }).first();

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

const clearDefaultForUser = (user_id) =>
  db(TABLE).where({ user_id }).update({ is_default: false });

const setDefault = async (id, user_id) => {
  await clearDefaultForUser(user_id);
  return db(TABLE).where({ id }).update({ is_default: true }).returning('*').then((rows) => rows[0]);
};

module.exports = {
  findById,
  findByUserId,
  findDefaultByUserId,
  create,
  update,
  remove,
  clearDefaultForUser,
  setDefault,
};
