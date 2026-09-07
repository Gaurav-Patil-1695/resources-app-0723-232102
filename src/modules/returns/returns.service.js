const db = require('../../db');
const { NotFoundError, ForbiddenError, ConflictError, BadRequestError } = require('../../errors');

const RETURNABLE_STATUSES = ['delivered'];
const RETURN_WINDOW_DAYS = 30;
const ALLOWED_REVIEW_DECISIONS = ['approved', 'rejected'];

/**
 * Check whether an order is eligible for a return.
 * @param {string} orderId
 * @param {string} userId
 * @returns {Promise<object>} order record
 */
async function checkReturnEligibility(orderId, userId) {
  const order = await db('orders').where({ id: orderId }).first();

  if (!order) {
    throw new NotFoundError('Order not found.');
  }

  if (order.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to return this order.');
  }

  if (!RETURNABLE_STATUSES.includes(order.status)) {
    throw new BadRequestError(
      `Order cannot be returned. Only orders with status "delivered" are eligible.`
    );
  }

  const deliveredAt = new Date(order.delivered_at || order.updated_at);
  const now = new Date();
  const diffMs = now - deliveredAt;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > RETURN_WINDOW_DAYS) {
    throw new BadRequestError(
      `Return window has expired. Returns must be requested within ${RETURN_WINDOW_DAYS} days of delivery.`
    );
  }

  return order;
}

/**
 * Initiate a return request for an order.
 * @param {string} orderId
 * @param {string} userId
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function initiateReturn(orderId, userId, payload) {
  const order = await checkReturnEligibility(orderId, userId);

  const existing = await db('return_requests')
    .where({ order_id: orderId })
    .whereNotIn('status', ['rejected', 'cancelled'])
    .first();

  if (existing) {
    throw new ConflictError('A return request for this order already exists.');
  }

  const [returnRequest] = await db('return_requests')
    .insert({
      order_id: orderId,
      user_id: userId,
      reason: payload.reason,
      items: JSON.stringify(payload.items || []),
      status: 'pending',
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return returnRequest;
}

/**
 * Get a return request scoped to a specific order.
 * @param {string} returnRequestId
 * @param {string} orderId
 * @param {string} userId
 * @param {boolean} isAdmin
 * @returns {Promise<object>}
 */
async function getReturnRequestByOrder(returnRequestId, orderId, userId, isAdmin) {
  const returnRequest = await db('return_requests')
    .where({ id: returnRequestId, order_id: orderId })
    .first();

  if (!returnRequest) {
    throw new NotFoundError('Return request not found.');
  }

  if (!isAdmin && returnRequest.user_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this return request.');
  }

  return returnRequest;
}

/**
 * List all return requests (admin).
 * @param {object} filters
 * @returns {Promise<object>}
 */
async function listReturnRequests(filters) {
  const { status, page, limit } = filters;
  const offset = (page - 1) * limit;

  let query = db('return_requests').orderBy('created_at', 'desc');

  if (status) {
    query = query.where({ status });
  }

  const total = await query.clone().count('id as count').first();
  const items = await query.offset(offset).limit(limit);

  return {
    data: items,
    meta: {
      total: parseInt(total.count, 10),
      page,
      limit,
    },
  };
}

/**
 * Get a return request by ID (admin).
 * @param {string} returnRequestId
 * @returns {Promise<object>}
 */
async function getReturnRequestById(returnRequestId) {
  const returnRequest = await db('return_requests').where({ id: returnRequestId }).first();

  if (!returnRequest) {
    throw new NotFoundError('Return request not found.');
  }

  return returnRequest;
}

/**
 * Review a return request: approve or reject.
 * On approval, trigger refund and restore stock.
 * @param {string} returnRequestId
 * @param {string} adminId
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function reviewReturnRequest(returnRequestId, adminId, payload) {
  const { decision, notes } = payload;

  if (!ALLOWED_REVIEW_DECISIONS.includes(decision)) {
    throw new BadRequestError(
      `Invalid decision. Allowed values are: ${ALLOWED_REVIEW_DECISIONS.join(', ')}.`
    );
  }

  const returnRequest = await db('return_requests').where({ id: returnRequestId }).first();

  if (!returnRequest) {
    throw new NotFoundError('Return request not found.');
  }

  if (returnRequest.status !== 'pending') {
    throw new ConflictError(
      `Return request has already been reviewed with status "${returnRequest.status}".`
    );
  }

  const trx = await db.transaction();

  try {
    const [updated] = await trx('return_requests')
      .where({ id: returnRequestId })
      .update({
        status: decision,
        reviewed_by: adminId,
        review_notes: notes || null,
        reviewed_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .returning('*');

    if (decision === 'approved') {
      await triggerRefund(returnRequest, trx);
      await restoreStock(returnRequest, trx);
    }

    await trx.commit();
    return updated;
  } catch (err) {
    await trx.rollback();
    throw err;
  }
}

/**
 * Trigger a refund for an approved return.
 * @param {object} returnRequest
 * @param {object} trx - knex transaction
 */
async function triggerRefund(returnRequest, trx) {
  const order = await trx('orders').where({ id: returnRequest.order_id }).first();

  if (!order) {
    throw new NotFoundError('Associated order not found during refund.');
  }

  await trx('refunds').insert({
    order_id: returnRequest.order_id,
    return_request_id: returnRequest.id,
    user_id: returnRequest.user_id,
    amount: order.total_amount,
    status: 'pending',
    created_at: trx.fn.now(),
    updated_at: trx.fn.now(),
  });
}

/**
 * Restore stock for returned items on approval.
 * @param {object} returnRequest
 * @param {object} trx - knex transaction
 */
async function restoreStock(returnRequest, trx) {
  let items;

  try {
    items = typeof returnRequest.items === 'string'
      ? JSON.parse(returnRequest.items)
      : returnRequest.items;
  } catch {
    items = [];
  }

  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  for (const item of items) {
    const { product_id, quantity } = item;
    if (!product_id || !quantity) continue;

    await trx('products')
      .where({ id: product_id })
      .increment('stock_quantity', quantity);
  }
}

module.exports = {
  initiateReturn,
  getReturnRequestByOrder,
  listReturnRequests,
  getReturnRequestById,
  reviewReturnRequest,
  checkReturnEligibility,
};
