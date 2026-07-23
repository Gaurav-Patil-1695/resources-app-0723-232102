const ordersService = require('./orders.service');

/**
 * GET /orders
 * List orders - supports filtering by status, userId, date range
 */
async function listOrders(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      userId: req.query.userId,
      from: req.query.from,
      to: req.query.to,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    const result = await ordersService.listOrders(filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:orderId
 * Get single order detail
 */
async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await ordersService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders/:orderId/advance
 * Advance order to next status
 */
async function advanceOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const updatedOrder = await ordersService.advanceOrderStatus(orderId, status, note);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders/:orderId/cancel
 * Cancel an order
 */
async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const updatedOrder = await ordersService.cancelOrder(orderId, reason);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:orderId/tracking
 * Get order tracking information
 */
async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const tracking = await ordersService.getOrderTracking(orderId);
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking information not found.' });
    }
    res.status(200).json(tracking);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:orderId/timeline
 * Get order status timeline / history
 */
async function getOrderTimeline(req, res, next) {
  try {
    const { orderId } = req.params;
    const timeline = await ordersService.getOrderTimeline(orderId);
    res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders/:orderId/return-requests
 * Submit a return request for an order
 */
async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const payload = req.body;
    const returnRequest = await ordersService.createReturnRequest(orderId, payload);
    res.status(201).json(returnRequest);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:orderId/refunds
 * Get refunds associated with an order
 */
async function getOrderRefunds(req, res, next) {
  try {
    const { orderId } = req.params;
    const refunds = await ordersService.getOrderRefunds(orderId);
    res.status(200).json(refunds);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  getOrder,
  advanceOrder,
  cancelOrder,
  getOrderTracking,
  getOrderTimeline,
  createReturnRequest,
  getOrderRefunds,
};
