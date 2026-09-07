const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');
const { validateCheckoutStart, validateCheckoutAddress, validatePlaceOrder } = require('./checkout.validator');
const { optionalAuth } = require('../../middleware/optionalAuth');

// All checkout routes support both authenticated and guest users
router.use(optionalAuth);

// Step 1: Start / initiate a checkout session
router.post('/start', validateCheckoutStart, checkoutController.startCheckout);

// Step 2: Submit / update shipping address
router.post('/address', validateCheckoutAddress, checkoutController.submitAddress);

// Step 3: Review order before placement
router.get('/review', checkoutController.reviewOrder);

// Step 4: Place / confirm the order
router.post('/place-order', validatePlaceOrder, checkoutController.placeOrder);

module.exports = router;
