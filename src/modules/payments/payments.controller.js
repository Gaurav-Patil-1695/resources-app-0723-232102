const paymentsService = require('./payments.service');

/**
 * POST /payments/initiate
 * Initiates a new payment transaction.
 */
async function initiatePayment(req, res, next) {
  try {
    const result = await paymentsService.initiatePayment(req.body);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/callback
 * Handles provider callback / webhook notification.
 */
async function handleCallback(req, res, next) {
  try {
    const result = await paymentsService.handleCallback(req.body, req.headers);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/confirm
 * Confirms a pending payment.
 */
async function confirmPayment(req, res, next) {
  try {
    const result = await paymentsService.confirmPayment(req.body);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /payments/:paymentId
 * Retrieves a payment by ID.
 */
async function getPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.getPaymentById(paymentId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/:paymentId/retry
 * Retries a failed payment.
 */
async function retryPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.retryPayment(paymentId, req.body);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  initiatePayment,
  handleCallback,
  confirmPayment,
  getPayment,
  retryPayment,
};
