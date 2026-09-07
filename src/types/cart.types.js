/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique cart item identifier
 * @property {string} cart_id - Associated cart identifier
 * @property {string} product_id - Associated product identifier
 * @property {string} sku_id - Associated SKU identifier
 * @property {string} name - Product name at time of adding
 * @property {string} image_url - Product image URL
 * @property {number} quantity - Quantity in cart
 * @property {number} unit_price - Unit price in smallest currency unit
 * @property {number} total_price - Total price for this line item
 * @property {Record<string, string>} attributes - SKU variant attributes
 * @property {string} added_at - ISO timestamp when item was added
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - Unique cart identifier
 * @property {string|null} user_id - Associated user identifier (null for guest)
 * @property {string|null} session_id - Guest session identifier
 * @property {CartItem[]} items - Items in the cart
 * @property {number} subtotal - Subtotal before discounts and taxes
 * @property {number} discount_amount - Total discount applied
 * @property {number} tax_amount - Tax amount
 * @property {number} total - Final cart total
 * @property {string|null} promo_code - Applied promo code string
 * @property {string|null} promo_code_id - Applied promo code identifier
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

export default {};
