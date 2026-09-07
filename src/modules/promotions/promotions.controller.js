const promotionsService = require('./promotions.service');

/**
 * POST /validate
 * Validate a promo code and return discount details.
 */
async function validateCode(req, res, next) {
  try {
    const { code, userId, orderTotal, items } = req.body;
    const result = await promotionsService.validateAndCalculate({ code, userId, orderTotal, items });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes
 * List all promo codes (admin).
 */
async function listPromoCodes(req, res, next) {
  try {
    const { page = 1, limit = 20, active } = req.query;
    const result = await promotionsService.listPromoCodes({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      active: active !== undefined ? active === 'true' : undefined,
    });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/promo-codes
 * Create a new promo code (admin).
 */
async function createPromoCode(req, res, next) {
  try {
    const promoData = req.body;
    const created = await promotionsService.createPromoCode(promoData);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes/:id
 * Get a single promo code by ID (admin).
 */
async function getPromoCode(req, res, next) {
  try {
    const { id } = req.params;
    const promo = await promotionsService.getPromoCodeById(id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }
    return res.status(200).json({ success: true, data: promo });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/promo-codes/:id
 * Update an existing promo code (admin).
 */
async function updatePromoCode(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await promotionsService.updatePromoCode(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/promo-codes/:id
 * Delete a promo code (admin).
 */
async function deletePromoCode(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await promotionsService.deletePromoCode(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }
    return res.status(200).json({ success: true, message: 'Promo code deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCode,
  listPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
};
