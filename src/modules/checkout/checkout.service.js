const { AppError } = require('../../utils/AppError');
const db = require('../../db');
const paymentService = require('../payment/payment.service');
const cartService = require('../cart/cart.service');

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the cart associated with a checkout session.
 * Supports both authenticated users and guests.
 */
async function resolveCart({ userId, guestToken, cartId }) {
  let cart;
  if (cartId) {
    cart = await cartService.getCartById(cartId);
  } else if (userId) {
    cart = await cartService.getCartByUserId(userId);
  } else if (guestToken) {
    cart = await cartService.getCartByGuestToken(guestToken);
  }

  if (!cart) {
    throw new AppError('Cart not found. Please add items before checking out.', 404);
  }
  if (!cart.items || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Please add items before checking out.', 400);
  }
  return cart;
}

/**
 * Validates that all cart items are still in stock.
 * Throws if any item has insufficient stock.
 */
async function validateStock(cartItems) {
  for (const item of cartItems) {
    const product = await db('products')
      .where({ id: item.product_id })
      .first();

    if (!product) {
      throw new AppError(`Product "${item.name}" is no longer available.`, 400);
    }
    if (product.stock_quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${product.name}". Only ${product.stock_quantity} unit(s) available.`,
        400
      );
    }
  }
}

/**
 * Validates and applies a promo code to a cart total.
 * Returns discount amount and promo record (or null).
 */
async function resolvePromo({ promoCode, subtotal }) {
  if (!promoCode) {
    return { discount: 0, promo: null };
  }

  const promo = await db('promo_codes')
    .where({ code: promoCode, is_active: true })
    .first();

  if (!promo) {
    throw new AppError('The promo code you entered is invalid or has expired.', 400);
  }

  const now = new Date();
  if (promo.expires_at && new Date(promo.expires_at) < now) {
    throw new AppError('The promo code you entered is invalid or has expired.', 400);
  }
  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    throw new AppError('This promo code has reached its usage limit.', 400);
  }
  if (subtotal < (promo.minimum_order_amount || 0)) {
    throw new AppError(
      `This promo code requires a minimum order of $${promo.minimum_order_amount}.`,
      400
    );
  }

  let discount = 0;
  if (promo.discount_type === 'percentage') {
    discount = parseFloat(((promo.discount_value / 100) * subtotal).toFixed(2));
  } else if (promo.discount_type === 'fixed') {
    discount = Math.min(promo.discount_value, subtotal);
  }

  return { discount, promo };
}

/**
 * Validates an address object for required fields.
 */
function validateAddressFields(address, label = 'Shipping address') {
  const required = ['firstName', 'lastName', 'addressLine1', 'city', 'state', 'postalCode', 'country'];
  for (const field of required) {
    if (!address[field] || String(address[field]).trim() === '') {
      throw new AppError(`${label}: ${field} is required.`, 400);
    }
  }

  const postalCodePattern = /^[A-Za-z0-9\s\-]{3,10}$/;
  if (!postalCodePattern.test(address.postalCode)) {
    throw new AppError(`${label}: Please enter a valid postal code.`, 400);
  }
}

/**
 * Retrieves a checkout session by ID, enforcing ownership.
 */
async function resolveSession({ checkoutSessionId, userId, guestToken }) {
  if (!checkoutSessionId) {
    throw new AppError('Checkout session ID is required.', 400);
  }

  const session = await db('checkout_sessions')
    .where({ id: checkoutSessionId })
    .first();

  if (!session) {
    throw new AppError('Checkout session not found or has expired.', 404);
  }

  const ownerMatch =
    (userId && session.user_id === userId) ||
    (guestToken && session.guest_token === guestToken);

  if (!ownerMatch) {
    throw new AppError('You do not have permission to access this checkout session.', 403);
  }

  return session;
}

// ---------------------------------------------------------------------------
// Public service methods
// ---------------------------------------------------------------------------

/**
 * Starts a checkout session.
 * - Resolves the cart
 * - Validates stock availability
 * - Applies optional promo code
 * - Creates or updates a checkout_sessions record
 */
async function startCheckout({ userId, guestToken, cartId, promoCode }) {
  const cart = await resolveCart({ userId, guestToken, cartId });

  await validateStock(cart.items);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const { discount, promo } = await resolvePromo({ promoCode, subtotal });

  const total = parseFloat((subtotal - discount).toFixed(2));

  const sessionData = {
    cart_id: cart.id,
    user_id: userId || null,
    guest_token: guestToken || null,
    promo_code_id: promo ? promo.id : null,
    subtotal,
    discount,
    total,
    status: 'initiated',
    updated_at: new Date(),
  };

  // Upsert checkout session
  let existingSession;
  if (userId) {
    existingSession = await db('checkout_sessions')
      .where({ user_id: userId, status: 'initiated' })
      .first();
  } else if (guestToken) {
    existingSession = await db('checkout_sessions')
      .where({ guest_token: guestToken, status: 'initiated' })
      .first();
  }

  let sessionId;
  if (existingSession) {
    await db('checkout_sessions').where({ id: existingSession.id }).update(sessionData);
    sessionId = existingSession.id;
  } else {
    sessionData.created_at = new Date();
    const [newId] = await db('checkout_sessions').insert(sessionData).returning('id');
    sessionId = newId;
  }

  return {
    checkoutSessionId: sessionId,
    cartId: cart.id,
    subtotal,
    discount,
    total,
    promoApplied: promo ? { code: promo.code, discount } : null,
    itemCount: cart.items.length,
  };
}

/**
 * Submits the shipping (and optionally billing) address for a checkout session.
 * - Validates address fields
 * - Persists address data to the session
 */
async function submitAddress({
  userId,
  checkoutSessionId,
  guestToken,
  shippingAddress,
  billingAddress,
  useSameAddress,
}) {
  const session = await resolveSession({ checkoutSessionId, userId, guestToken });

  validateAddressFields(shippingAddress, 'Shipping address');

  if (!useSameAddress && billingAddress) {
    validateAddressFields(billingAddress, 'Billing address');
  }

  const effectiveBilling = useSameAddress ? shippingAddress : billingAddress;

  await db('checkout_sessions').where({ id: session.id }).update({
    shipping_address: JSON.stringify(shippingAddress),
    billing_address: JSON.stringify(effectiveBilling),
    use_same_address: useSameAddress,
    status: 'address_provided',
    updated_at: new Date(),
  });

  return {
    checkoutSessionId: session.id,
    shippingAddress,
    billingAddress: effectiveBilling,
    nextStep: 'review',
  };
}

/**
 * Returns a complete order summary for the review step.
 * - Includes cart items, pricing breakdown, address, and promo info
 */
async function reviewOrder({ userId, checkoutSessionId, guestToken }) {
  const session = await resolveSession({ checkoutSessionId, userId, guestToken });

  const cart = await cartService.getCartById(session.cart_id);
  if (!cart) {
    throw new AppError('Cart associated with this session could not be found.', 404);
  }

  let promo = null;
  if (session.promo_code_id) {
    promo = await db('promo_codes').where({ id: session.promo_code_id }).first();
  }

  const shippingAddress = session.shipping_address
    ? JSON.parse(session.shipping_address)
    : null;
  const billingAddress = session.billing_address
    ? JSON.parse(session.billing_address)
    : null;

  return {
    checkoutSessionId: session.id,
    items: cart.items,
    subtotal: parseFloat(session.subtotal),
    discount: parseFloat(session.discount),
    total: parseFloat(session.total),
    promo: promo ? { code: promo.code, discount: parseFloat(session.discount) } : null,
    shippingAddress,
    billingAddress,
    status: session.status,
  };
}

/**
 * Places the order.
 * - Re-validates stock (guard against race conditions)
 * - Finalises promo usage
 * - Creates the order and order_items records
 * - Delegates payment intent creation
 * - Clears the cart
 */
async function placeOrder({
  userId,
  checkoutSessionId,
  guestToken,
  paymentMethod,
  paymentDetails,
  agreedToTerms,
}) {
  if (!agreedToTerms) {
    throw new AppError('You must agree to the terms and conditions to place an order.', 400);
  }

  const session = await resolveSession({ checkoutSessionId, userId, guestToken });

  if (!session.shipping_address) {
    throw new AppError('Please provide a shipping address before placing your order.', 400);
  }

  const cart = await cartService.getCartById(session.cart_id);
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Please add items before checking out.', 400);
  }

  // Re-validate stock before committing
  await validateStock(cart.items);

  const shippingAddress = JSON.parse(session.shipping_address);
  const billingAddress = JSON.parse(session.billing_address);

  const trx = await db.transaction();

  try {
    // Create order record
    const orderData = {
      user_id: userId || null,
      guest_token: guestToken || null,
      status: 'pending_payment',
      subtotal: session.subtotal,
      discount: session.discount,
      total: session.total,
      promo_code_id: session.promo_code_id || null,
      shipping_address: session.shipping_address,
      billing_address: session.billing_address,
      payment_method: paymentMethod,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [orderId] = await trx('orders').insert(orderData).returning('id');

    // Create order_items and decrement stock
    for (const item of cart.items) {
      await trx('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        line_total: parseFloat((item.price * item.quantity).toFixed(2)),
        created_at: new Date(),
      });

      await trx('products')
        .where({ id: item.product_id })
        .decrement('stock_quantity', item.quantity);
    }

    // Finalise promo usage
    if (session.promo_code_id) {
      await trx('promo_codes')
        .where({ id: session.promo_code_id })
        .increment('usage_count', 1);
    }

    // Mark checkout session as completed
    await trx('checkout_sessions').where({ id: session.id }).update({
      status: 'completed',
      order_id: orderId,
      updated_at: new Date(),
    });

    await trx.commit();

    // Delegate payment intent creation outside of transaction
    let paymentIntent = null;
    try {
      paymentIntent = await paymentService.createPaymentIntent({
        orderId,
        amount: parseFloat(session.total),
        currency: 'usd',
        paymentMethod,
        paymentDetails,
        userId,
        guestToken,
      });
    } catch (paymentError) {
      // Mark order as payment_failed but do not roll back — order record is kept
      await db('orders').where({ id: orderId }).update({
        status: 'payment_failed',
        updated_at: new Date(),
      });
      throw new AppError('Payment processing failed. Please try again or use a different payment method.', 402);
    }

    // Clear the cart
    await cartService.clearCart(cart.id);

    return {
      orderId,
      status: 'pending_payment',
      total: parseFloat(session.total),
      paymentIntent,
      shippingAddress,
      billingAddress,
    };
  } catch (err) {
    await trx.rollback();
    throw err;
  }
}

module.exports = {
  startCheckout,
  submitAddress,
  reviewOrder,
  placeOrder,
};
