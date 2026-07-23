/**
 * Default GST rate (18%).
 */
export const DEFAULT_GST_RATE = 0.18;

/**
 * Derives a GST-inclusive display price from a base (exclusive) price.
 * @param {number} basePrice - Price excluding GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} GST-inclusive price.
 */
export function getInclusivePrice(basePrice, gstRate = DEFAULT_GST_RATE) {
  return basePrice * (1 + gstRate);
}

/**
 * Extracts the tax portion from a GST-inclusive price.
 * @param {number} inclusivePrice - Price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal.
 * @returns {number} Tax amount embedded in the inclusive price.
 */
export function extractTaxFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  return inclusivePrice - inclusivePrice / (1 + gstRate);
}

/**
 * Extracts the base (pre-tax) price from a GST-inclusive price.
 * @param {number} inclusivePrice - Price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal.
 * @returns {number} Base price before tax.
 */
export function extractBaseFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  return inclusivePrice / (1 + gstRate);
}

/**
 * Builds a tax breakdown object for display.
 * @param {number} inclusivePrice - GST-inclusive price.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal.
 * @returns {{ basePrice: number, taxAmount: number, gstRate: number, cgst: number, sgst: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const taxAmount = extractTaxFromInclusive(inclusivePrice, gstRate);
  const basePrice = extractBaseFromInclusive(inclusivePrice, gstRate);
  return {
    basePrice,
    taxAmount,
    gstRate,
    cgst: taxAmount / 2,
    sgst: taxAmount / 2,
  };
}
