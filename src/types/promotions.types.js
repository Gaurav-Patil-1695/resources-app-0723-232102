/**
 * @typedef {'percentage'|'flat'|'free_shipping'} DiscountType
 */

/**
 * @typedef {Object} PromoCode
 * @property {string} id - Unique promo code identifier
 * @property {string} code - The promo code string
 * @property {string|null} description - Human-readable description of the promo
 * @property {DiscountType} discount_type - Type of discount applied
 * @property {number} discount_value - Discount value (percentage or flat amount)
 * @property {number|null} max_discount_amount - Maximum discount cap (for percentage type)
 * @property {number|null} min_order_amount - Minimum order amount required
 * @property {number|null} max_uses - Maximum number of total uses allowed (null for unlimited)
 * @property {number} current_uses - Current number of times used
 * @property {number|null} max_uses_per_user - Maximum uses per user (null for unlimited)
 * @property {boolean} is_active - Whether promo code is active
 * @property {string|null} starts_at - ISO timestamp when promo becomes valid
 * @property {string|null} expires_at - ISO timestamp when promo expires
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

export default {};
