const express = require('express');
const router = express.Router();
const promotionsController = require('./promotions.controller');
const { validatePromoCode, validateCreatePromo, validateUpdatePromo } = require('./promotions.validator');
const { validate } = require('../../middleware/validate');
const { authenticate, requireAdmin } = require('../../middleware/auth');

// Public: validate a promo code
router.post('/validate', validate(validatePromoCode), promotionsController.validateCode);

// Admin: CRUD for promo codes
router.use('/admin/promo-codes', authenticate, requireAdmin);

router.get('/admin/promo-codes', promotionsController.listPromoCodes);
router.post('/admin/promo-codes', validate(validateCreatePromo), promotionsController.createPromoCode);
router.get('/admin/promo-codes/:id', promotionsController.getPromoCode);
router.put('/admin/promo-codes/:id', validate(validateUpdatePromo), promotionsController.updatePromoCode);
router.delete('/admin/promo-codes/:id', promotionsController.deletePromoCode);

module.exports = router;
