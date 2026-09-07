/**
 * Free shipping threshold in Indian Rupees.
 */
export const FREE_SHIPPING_THRESHOLD = 799;

/**
 * Standard shipping charge in Indian Rupees.
 */
export const STANDARD_SHIPPING_CHARGE = 49;

/**
 * Computes the shipping charge based on the order total.
 * Returns ₹0 if the order total is ₹799 or above, otherwise ₹49.
 * @param {number} orderTotal - The total order amount in INR.
 * @returns {number} Shipping charge in INR.
 */
export function computeShippingCharge(orderTotal) {
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_CHARGE;
}

/**
 * Determines whether the order qualifies for free shipping.
 * @param {number} orderTotal - The total order amount in INR.
 * @returns {boolean} True if shipping is free.
 */
export function isFreeShipping(orderTotal) {
  return orderTotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Returns the amount remaining to qualify for free shipping.
 * @param {number} orderTotal - The total order amount in INR.
 * @returns {number} Amount still needed for free shipping, or 0 if already qualified.
 */
export function amountToFreeShipping(orderTotal) {
  const remaining = FREE_SHIPPING_THRESHOLD - orderTotal;
  return remaining > 0 ? remaining : 0;
}
