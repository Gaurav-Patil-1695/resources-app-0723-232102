const express = require('express');
const router = express.Router({ mergeParams: true });
const returnsController = require('./returns.controller');
const { validateReturnRequest, validateReview } = require('./returns.validator');
const authenticate = require('../../middleware/authenticate');
const authorizeAdmin = require('../../middleware/authorizeAdmin');

// Customer routes (mounted under /orders/:orderId)
router.post(
  '/orders/:orderId/return-requests',
  authenticate,
  validateReturnRequest,
  returnsController.createReturnRequest
);

router.get(
  '/orders/:orderId/return-requests/:returnRequestId',
  authenticate,
  returnsController.getReturnRequestByOrder
);

// Admin routes
router.get(
  '/return-requests',
  authenticate,
  authorizeAdmin,
  returnsController.listReturnRequests
);

router.get(
  '/return-requests/:returnRequestId',
  authenticate,
  authorizeAdmin,
  returnsController.getReturnRequest
);

router.post(
  '/return-requests/:returnRequestId/review',
  authenticate,
  authorizeAdmin,
  validateReview,
  returnsController.reviewReturnRequest
);

module.exports = router;
