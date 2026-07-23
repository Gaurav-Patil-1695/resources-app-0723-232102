const checkoutService = require('./checkout.service');
const { asyncHandler } = require('../../utils/asyncHandler');

/**
 * POST /checkout/start
 * Initiates a checkout session from the current cart.
 * Supports both authenticated users and guests (via guestToken).
 */
const startCheckout = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { guestToken, cartId, promoCode } = req.body;

  const session = await checkoutService.startCheckout({ userId, guestToken, cartId, promoCode });

  res.status(200).json({
    success: true,
    data: session,
  });
});

/**
 * POST /checkout/address
 * Submits or updates the shipping address for the checkout session.
 */
const submitAddress = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { checkoutSessionId, guestToken, shippingAddress, billingAddress, useSameAddress } = req.body;

  const result = await checkoutService.submitAddress({
    userId,
    checkoutSessionId,
    guestToken,
    shippingAddress,
    billingAddress: useSameAddress ? shippingAddress : billingAddress,
    useSameAddress,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /checkout/review
 * Returns a full summary of the pending order for user review.
 */
const reviewOrder = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { checkoutSessionId, guestToken } = req.query;

  const summary = await checkoutService.reviewOrder({ userId, checkoutSessionId, guestToken });

  res.status(200).json({
    success: true,
    data: summary,
  });
});

/**
 * POST /checkout/place-order
 * Confirms stock, finalises promo, creates order record, and delegates payment intent creation.
 */
const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const {
    checkoutSessionId,
    guestToken,
    paymentMethod,
    paymentDetails,
    agreedToTerms,
  } = req.body;

  const order = await checkoutService.placeOrder({
    userId,
    checkoutSessionId,
    guestToken,
    paymentMethod,
    paymentDetails,
    agreedToTerms,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

module.exports = {
  startCheckout,
  submitAddress,
  reviewOrder,
  placeOrder,
};
