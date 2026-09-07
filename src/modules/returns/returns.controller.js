const returnsService = require('./returns.service');

/**
 * POST /orders/:orderId/return-requests
 * Initiate a return request for an order.
 */
async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payload = req.body;
    const returnRequest = await returnsService.initiateReturn(orderId, userId, payload);
    return res.status(201).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:orderId/return-requests/:returnRequestId
 * Get a specific return request scoped to an order.
 */
async function getReturnRequestByOrder(req, res, next) {
  try {
    const { orderId, returnRequestId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const returnRequest = await returnsService.getReturnRequestByOrder(
      returnRequestId,
      orderId,
      userId,
      isAdmin
    );
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests
 * Admin: list all return requests.
 */
async function listReturnRequests(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    const result = await returnsService.listReturnRequests(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Admin: get a return request by ID.
 */
async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const returnRequest = await returnsService.getReturnRequestById(returnRequestId);
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin: approve or reject a return request.
 */
async function reviewReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const adminId = req.user.id;
    const payload = req.body;
    const result = await returnsService.reviewReturnRequest(returnRequestId, adminId, payload);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReturnRequest,
  getReturnRequestByOrder,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
};
