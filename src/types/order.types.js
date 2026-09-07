/**
 * @typedef {Object} OrderItem
 * @property {string} id - Unique order item identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} product_id - Associated product identifier
 * @property {string} sku_id - Associated SKU identifier
 * @property {string} name - Product name at time of order
 * @property {string} image_url - Product image URL at time of order
 * @property {Record<string, string>} attributes - SKU variant attributes at time of order
 * @property {number} quantity - Ordered quantity
 * @property {number} unit_price - Unit price at time of order
 * @property {number} total_price - Total price for this line item
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id - Unique status history entry identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} status - Order status value
 * @property {string|null} note - Optional note for this status change
 * @property {string} changed_by - Identifier of user who changed the status
 * @property {string} created_at - ISO timestamp of status change
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} id - Unique tracking identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} carrier - Shipping carrier name
 * @property {string} tracking_number - Tracking number string
 * @property {string|null} tracking_url - URL to track shipment
 * @property {string} estimated_delivery - ISO date string for estimated delivery
 * @property {string} current_status - Current tracking status
 * @property {string} updated_at - ISO timestamp of last tracking update
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Unique order identifier
 * @property {string} order_number - Human-readable order number
 * @property {string} user_id - Associated user identifier
 * @property {'pending'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled'|'returned'} status - Current order status
 * @property {OrderItem[]} items - Items in the order
 * @property {Object} shipping_address - Shipping address snapshot
 * @property {Object} billing_address - Billing address snapshot
 * @property {number} subtotal - Subtotal before discounts and taxes
 * @property {number} discount_amount - Total discount applied
 * @property {number} shipping_amount - Shipping cost
 * @property {number} tax_amount - Tax amount
 * @property {number} total - Final order total
 * @property {string|null} promo_code - Applied promo code string
 * @property {string|null} payment_id - Associated payment identifier
 * @property {OrderTracking|null} tracking - Shipping tracking information
 * @property {OrderStatusHistory[]} status_history - History of status changes
 * @property {string} created_at - ISO timestamp of order creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export default {};
