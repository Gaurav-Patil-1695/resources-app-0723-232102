const db = require('../../db');

const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

/**
 * Validate a promo code and calculate the applicable discount.
 * @param {object} params
 * @param {string} params.code
 * @param {string|number} params.userId
 * @param {number} params.orderTotal
 * @param {Array} params.items
 * @returns {object} discount details
 */
async function validateAndCalculate({ code, userId, orderTotal, items }) {
  const promo = await db('promo_codes')
    .where({ code: code.toUpperCase().trim(), is_active: true })
    .first();

  if (!promo) {
    const err = new Error('Invalid or inactive promo code.');
    err.statusCode = 422;
    throw err;
  }

  const now = new Date();

  if (promo.starts_at && new Date(promo.starts_at) > now) {
    const err = new Error('This promo code is not yet active.');
    err.statusCode = 422;
    throw err;
  }

  if (promo.expires_at && new Date(promo.expires_at) < now) {
    const err = new Error('This promo code has expired.');
    err.statusCode = 422;
    throw err;
  }

  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
    const err = new Error('This promo code has reached its usage limit.');
    err.statusCode = 422;
    throw err;
  }

  if (promo.min_order_amount !== null && orderTotal < promo.min_order_amount) {
    const err = new Error(
      `A minimum order total of ${promo.min_order_amount} is required to use this promo code.`
    );
    err.statusCode = 422;
    throw err;
  }

  if (promo.max_uses_per_user !== null && userId) {
    const userUsageCount = await db('promo_code_usages')
      .where({ promo_code_id: promo.id, user_id: userId })
      .count('id as count')
      .first();
    if (parseInt(userUsageCount.count, 10) >= promo.max_uses_per_user) {
      const err = new Error('You have already used this promo code the maximum number of times.');
      err.statusCode = 422;
      throw err;
    }
  }

  const discountAmount = calculateDiscount(promo, orderTotal);
  const finalTotal = Math.max(0, orderTotal - discountAmount);

  return {
    promoCodeId: promo.id,
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    originalTotal: parseFloat(orderTotal.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
  };
}

/**
 * Calculate the discount amount based on promo type.
 * @param {object} promo
 * @param {number} orderTotal
 * @returns {number}
 */
function calculateDiscount(promo, orderTotal) {
  if (promo.discount_type === DISCOUNT_TYPES.PERCENTAGE) {
    const discount = (orderTotal * promo.discount_value) / 100;
    if (promo.max_discount_amount !== null) {
      return Math.min(discount, promo.max_discount_amount);
    }
    return discount;
  }
  if (promo.discount_type === DISCOUNT_TYPES.FIXED) {
    return Math.min(promo.discount_value, orderTotal);
  }
  return 0;
}

/**
 * Record usage of a promo code after a successful order.
 * @param {string|number} promoCodeId
 * @param {string|number} userId
 * @param {string|number} orderId
 */
async function recordUsage(promoCodeId, userId, orderId) {
  await db.transaction(async (trx) => {
    await trx('promo_code_usages').insert({
      promo_code_id: promoCodeId,
      user_id: userId,
      order_id: orderId,
      used_at: new Date(),
    });
    await trx('promo_codes').where({ id: promoCodeId }).increment('uses_count', 1);
  });
}

/**
 * List promo codes with optional filtering and pagination.
 */
async function listPromoCodes({ page = 1, limit = 20, active } = {}) {
  const offset = (page - 1) * limit;
  const query = db('promo_codes').orderBy('created_at', 'desc');

  if (active !== undefined) {
    query.where({ is_active: active });
  }

  const [totalResult, rows] = await Promise.all([
    query.clone().count('id as count').first(),
    query.clone().limit(limit).offset(offset),
  ]);

  return {
    total: parseInt(totalResult.count, 10),
    page,
    limit,
    items: rows,
  };
}

/**
 * Get a single promo code by ID.
 */
async function getPromoCodeById(id) {
  return db('promo_codes').where({ id }).first();
}

/**
 * Create a new promo code.
 */
async function createPromoCode(data) {
  const normalized = {
    ...data,
    code: data.code.toUpperCase().trim(),
    is_active: data.is_active !== undefined ? data.is_active : true,
    uses_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const existing = await db('promo_codes').where({ code: normalized.code }).first();
  if (existing) {
    const err = new Error('A promo code with this code already exists.');
    err.statusCode = 409;
    throw err;
  }

  const [id] = await db('promo_codes').insert(normalized);
  return getPromoCodeById(id);
}

/**
 * Update an existing promo code.
 */
async function updatePromoCode(id, updates) {
  const promo = await getPromoCodeById(id);
  if (!promo) return null;

  const normalized = { ...updates, updated_at: new Date() };
  if (updates.code) {
    normalized.code = updates.code.toUpperCase().trim();
    const existing = await db('promo_codes')
      .where({ code: normalized.code })
      .whereNot({ id })
      .first();
    if (existing) {
      const err = new Error('A promo code with this code already exists.');
      err.statusCode = 409;
      throw err;
    }
  }

  await db('promo_codes').where({ id }).update(normalized);
  return getPromoCodeById(id);
}

/**
 * Delete a promo code by ID.
 */
async function deletePromoCode(id) {
  const promo = await getPromoCodeById(id);
  if (!promo) return null;
  await db('promo_codes').where({ id }).del();
  return true;
}

module.exports = {
  validateAndCalculate,
  calculateDiscount,
  recordUsage,
  listPromoCodes,
  getPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
};
