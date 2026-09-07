const db = require('../knex');

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

// Orders
const findById = (id) =>
  db(ORDERS_TABLE).where({ id }).first();

const findByOrderNumber = (order_number) =>
  db(ORDERS_TABLE).where({ order_number }).first();

const findByUserId = (user_id, { limit = 20, offset = 0 } = {}) =>
  db(ORDERS_TABLE).where({ user_id }).orderBy('created_at', 'desc').limit(limit).offset(offset);

const list = ({ limit = 20, offset = 0, status, user_id } = {}) => {
  const query = db(ORDERS_TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) query.where({ status });
  if (user_id) query.where({ user_id });
  return query;
};

const count = (filters = {}) =>
  db(ORDERS_TABLE).where(filters).count('id as total').first().then((row) => parseInt(row.total, 10));

const createOrder = (data, trx = db) =>
  trx(ORDERS_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const updateOrder = (id, data, trx = db) =>
  trx(ORDERS_TABLE).where({ id }).update(data).returning('*').then((rows) => rows[0]);

const updateStatus = (id, status, trx = db) =>
  updateOrder(id, { status, updated_at: db.fn.now() }, trx);

// Order Items
const findItemById = (id) =>
  db(ITEMS_TABLE).where({ id }).first();

const listItemsByOrderId = (order_id) =>
  db(ITEMS_TABLE).where({ order_id }).orderBy('created_at');

const createItem = (data, trx = db) =>
  trx(ITEMS_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const createItems = (items, trx = db) =>
  trx(ITEMS_TABLE).insert(items).returning('*');

// Status History
const addStatusHistory = (data, trx = db) =>
  trx(HISTORY_TABLE).insert(data).returning('*').then((rows) => rows[0]);

const getStatusHistory = (order_id) =>
  db(HISTORY_TABLE).where({ order_id }).orderBy('created_at', 'asc');

// Tracking
const findTracking = (order_id) =>
  db(TRACKING_TABLE).where({ order_id }).orderBy('updated_at', 'desc').first();

const upsertTracking = async (order_id, data) => {
  const existing = await findTracking(order_id);
  if (existing) {
    return db(TRACKING_TABLE).where({ order_id }).update({ ...data, updated_at: db.fn.now() }).returning('*').then((rows) => rows[0]);
  }
  return db(TRACKING_TABLE).insert({ order_id, ...data }).returning('*').then((rows) => rows[0]);
};

const getOrderWithDetails = async (order_id) => {
  const order = await findById(order_id);
  if (!order) return null;
  const [items, statusHistory, tracking] = await Promise.all([
    listItemsByOrderId(order_id),
    getStatusHistory(order_id),
    findTracking(order_id),
  ]);
  return { ...order, items, statusHistory, tracking };
};

module.exports = {
  findById,
  findByOrderNumber,
  findByUserId,
  list,
  count,
  createOrder,
  updateOrder,
  updateStatus,
  findItemById,
  listItemsByOrderId,
  createItem,
  createItems,
  addStatusHistory,
  getStatusHistory,
  findTracking,
  upsertTracking,
  getOrderWithDetails,
};
