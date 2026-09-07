const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { validateAdvanceOrder, validateCancelOrder, validateReturnRequest } = require('./orders.validator');

// Order list and detail
router.get('/', ordersController.listOrders);
router.get('/:orderId', ordersController.getOrder);

// Order status management
router.post('/:orderId/advance', validateAdvanceOrder, ordersController.advanceOrder);
router.post('/:orderId/cancel', validateCancelOrder, ordersController.cancelOrder);

// Tracking and timeline
router.get('/:orderId/tracking', ordersController.getOrderTracking);
router.get('/:orderId/timeline', ordersController.getOrderTimeline);

// Return requests and refunds
router.post('/:orderId/return-requests', validateReturnRequest, ordersController.createReturnRequest);
router.get('/:orderId/refunds', ordersController.getOrderRefunds);

module.exports = router;
