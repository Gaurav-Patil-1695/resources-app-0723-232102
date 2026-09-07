const db = require('../knex');

const TABLE = 'serviceable_pin_codes';

const findByPinCode = (pin_code) =>
  db(TABLE).where({ pin_code }).first();

const isServiceable = async (pin_code) => {
  const record = await db(TABLE).where({ pin_code, is_active: true }).first();
  return !!record;
};

const list = ({ limit = 100, offset = 0 } = {}) =>
  db(TABLE).orderBy('pin_code').limit(limit).offset(offset);

const create = (data) =>
  db(TABLE).insert(data).returning('*').then((rows) => rows[0]);

const update = (id, data) =>
  db(TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const remove = (id) =>
  db(TABLE).where({ id }).del();

const bulkInsert = (records) =>
  db(TABLE).insert(records).onConflict('pin_code').merge().returning('*');

const deactivate = (pin_code) =>
  db(TABLE).where({ pin_code }).update({ is_active: false });

const activate = (pin_code) =>
  db(TABLE).where({ pin_code }).update({ is_active: true });

module.exports = {
  findByPinCode,
  isServiceable,
  list,
  create,
  update,
  remove,
  bulkInsert,
  deactivate,
  activate,
};
