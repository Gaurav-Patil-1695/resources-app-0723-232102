const db = require('../../db');

// Valid order status transitions
const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

/**
 * List orders with optional filters and pagination
 */
async function listOrders({ status, userId, from, to, page, limit }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`o.status = $${values.length}`);
  }
  if (userId) {
    values.push(userId);
    conditions.push(`o.user_id = $${values.length}`);
  }
  if (from) {
    values.push(from);
    conditions.push(`o.created_at >= $${values.length}`);
  }
  if (to) {
    values.push(to);
    conditions.push(`o.created_at <= $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitClause = `$${values.length}`;
  values.push(offset);
  const offsetClause = `$${values.length}`;

  const query = `
    SELECT o.*
    FROM orders o
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ${limitClause} OFFSET ${offsetClause}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders o
    ${where}
  `;

  const countValues = values.slice(0, values.length - 2);

  const [rows, countResult] = await Promise.all([
    db.query(query, values),
    db.query(countQuery, countValues),
  ]);

  return {
    data: rows.rows,
    meta: {
      total: parseInt(countResult.rows[0].total, 10),
      page,
      limit,
    },
  };
}

/**
 * Get a single order by ID with its items
 */
async function getOrderById(orderId) {
  const orderResult = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsResult = await db.query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );

  order.items = itemsResult.rows;

  return order;
}

/**
 * Create an order — called by the checkout flow
 */
async function createOrder({ userId, items, shippingAddress, paymentMethod, totalAmount }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, shipping_address, payment_method, total_amount, created_at, updated_at)
       VALUES ($1, 'pending', $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userId, JSON.stringify(shippingAddress), paymentMethod, totalAmount]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [order.id, item.productId, item.quantity, item.unitPrice]
      );
    }

    await writeStatusHistory(client, order.id, 'pending', null, 'Order created');

    await client.query('COMMIT');

    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Advance order to a new status with validation of allowed transitions
 */
async function advanceOrderStatus(orderId, newStatus, note) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 FOR UPDATE',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const order = orderResult.rows[0];
    const currentStatus = order.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      const err = new Error(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'.`
      );
      err.statusCode = 422;
      throw err;
    }

    const updatedResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    await writeStatusHistory(client, orderId, newStatus, currentStatus, note || null);

    if (newStatus === 'shipped') {
      await upsertOrderTracking(client, orderId, { status: 'shipped', note });
    }

    await client.query('COMMIT');

    return updatedResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Cancel an order
 */
async function cancelOrder(orderId, reason) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 FOR UPDATE',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const order = orderResult.rows[0];
    const currentStatus = order.status;
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes('cancelled')) {
      const err = new Error(
        `Order cannot be cancelled from status '${currentStatus}'.`
      );
      err.statusCode = 422;
      throw err;
    }

    const updatedResult = await client.query(
      `UPDATE orders SET status = 'cancelled', cancellation_reason = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [reason || null, orderId]
    );

    await writeStatusHistory(client, orderId, 'cancelled', currentStatus, reason || 'Order cancelled');

    await client.query('COMMIT');

    return updatedResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get tracking information for an order
 */
async function getOrderTracking(orderId) {
  const result = await db.query(
    'SELECT * FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC',
    [orderId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows;
}

/**
 * Get order status timeline / history
 */
async function getOrderTimeline(orderId) {
  const result = await db.query(
    `SELECT * FROM order_status_history
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId]
  );

  return result.rows;
}

/**
 * Create a return request for an order
 */
async function createReturnRequest(orderId, { reason, items, note }) {
  const orderResult = await db.query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    const err = new Error('Order not found.');
    err.statusCode = 404;
    throw err;
  }

  const order = orderResult.rows[0];

  if (!['delivered', 'shipped'].includes(order.status)) {
    const err = new Error(
      `Return request cannot be created for an order with status '${order.status}'.`
    );
    err.statusCode = 422;
    throw err;
  }

  const result = await db.query(
    `INSERT INTO return_requests (order_id, reason, items, note, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
     RETURNING *`,
    [orderId, reason || null, JSON.stringify(items || []), note || null]
  );

  return result.rows[0];
}

/**
 * Get refunds for an order
 */
async function getOrderRefunds(orderId) {
  const result = await db.query(
    'SELECT * FROM refunds WHERE order_id = $1 ORDER BY created_at DESC',
    [orderId]
  );

  return result.rows;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function writeStatusHistory(client, orderId, newStatus, previousStatus, note) {
  await client.query(
    `INSERT INTO order_status_history (order_id, status, previous_status, note, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [orderId, newStatus, previousStatus || null, note || null]
  );
}

async function upsertOrderTracking(client, orderId, { status, note, carrier, trackingNumber, estimatedDelivery }) {
  const existing = await client.query(
    'SELECT id FROM order_tracking WHERE order_id = $1',
    [orderId]
  );

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE order_tracking
       SET status = $1, note = $2, carrier = COALESCE($3, carrier),
           tracking_number = COALESCE($4, tracking_number),
           estimated_delivery = COALESCE($5, estimated_delivery),
           updated_at = NOW()
       WHERE order_id = $6`,
      [status, note || null, carrier || null, trackingNumber || null, estimatedDelivery || null, orderId]
    );
  } else {
    await client.query(
      `INSERT INTO order_tracking (order_id, status, note, carrier, tracking_number, estimated_delivery, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [orderId, status, note || null, carrier || null, trackingNumber || null, estimatedDelivery || null]
    );
  }
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  advanceOrderStatus,
  cancelOrder,
  getOrderTracking,
  getOrderTimeline,
  createReturnRequest,
  getOrderRefunds,
};
