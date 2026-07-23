/**
 * @typedef {'success'|'failure'|'pending'} PaymentStatus
 */

/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id - Unique payment attempt identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} user_id - Associated user identifier
 * @property {string} gateway - Payment gateway name (e.g. 'razorpay', 'stripe')
 * @property {string} gateway_order_id - Order identifier from payment gateway
 * @property {string|null} gateway_payment_id - Payment identifier from gateway (set on completion)
 * @property {number} amount - Payment amount in smallest currency unit
 * @property {string} currency - Currency code (e.g. 'INR')
 * @property {PaymentStatus} status - Current payment status
 * @property {string|null} failure_reason - Reason for failure if status is 'failure'
 * @property {string} created_at - ISO timestamp of attempt creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} PaymentOutcome
 * @property {PaymentStatus} status - Outcome status: 'success', 'failure', or 'pending'
 * @property {string} payment_id - Associated payment attempt identifier
 * @property {string|null} gateway_payment_id - Gateway payment identifier
 * @property {string|null} failure_reason - Reason for failure if applicable
 * @property {string|null} redirect_url - URL to redirect to after payment (if applicable)
 * @property {string} message - Human-readable outcome message
 */

export default {};
