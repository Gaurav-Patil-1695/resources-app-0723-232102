/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cart_id - Cart identifier to checkout
 * @property {string} shipping_address_id - Selected shipping address identifier
 * @property {string} billing_address_id - Selected billing address identifier
 * @property {string} [promo_code] - Optional promo code to apply
 * @property {'standard'|'express'|'overnight'} shipping_method - Selected shipping method
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} order_id - Order identifier to confirm
 * @property {string} payment_method - Payment method identifier
 * @property {string} [payment_token] - Payment gateway token (for card payments)
 * @property {boolean} save_payment_method - Whether to save payment method for future use
 */

export default {};
