const db = require('../knex');

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

// Carts
const findById = (id) =>
  db(CARTS_TABLE).where({ id }).first();

const findByUserId = (user_id) =>
  db(CARTS_TABLE).where({ user_id }).first();

const findBySessionId = (session_id) =>
  db(CARTS_TABLE).where({ session_id }).first();

const createCart = (data) =>
  db(CARTS_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const updateCart = (id, data) =>
  db(CARTS_TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const deleteCart = (id) =>
  db(CARTS_TABLE).where({ id }).del();

// Cart Items
const findItemById = (id) =>
  db(ITEMS_TABLE).where({ id }).first();

const findItemByCartAndSku = (cart_id, sku_id) =>
  db(ITEMS_TABLE).where({ cart_id, sku_id }).first();

const listItemsByCartId = (cart_id) =>
  db(ITEMS_TABLE).where({ cart_id }).orderBy('created_at');

const addItem = (data) =>
  db(ITEMS_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const updateItem = (id, data) =>
  db(ITEMS_TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const removeItem = (id) =>
  db(ITEMS_TABLE).where({ id }).del();

const clearItems = (cart_id) =>
  db(ITEMS_TABLE).where({ cart_id }).del();

const upsertItem = async (cart_id, sku_id, quantity) => {
  const existing = await findItemByCartAndSku(cart_id, sku_id);
  if (existing) {
    return updateItem(existing.id, { quantity, updated_at: db.fn.now() });
  }
  return addItem({ cart_id, sku_id, quantity });
};

const getCartWithItems = async (cart_id) => {
  const cart = await findById(cart_id);
  if (!cart) return null;
  const items = await listItemsByCartId(cart_id);
  return { ...cart, items };
};

module.exports = {
  findById,
  findByUserId,
  findBySessionId,
  createCart,
  updateCart,
  deleteCart,
  findItemById,
  findItemByCartAndSku,
  listItemsByCartId,
  addItem,
  updateItem,
  removeItem,
  clearItems,
  upsertItem,
  getCartWithItems,
};
