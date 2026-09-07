import api from './api';

const promotionsService = {
  // Promo code validation
  validatePromoCode: async (payload) => {
    const response = await api.post('/promo-codes/validate', payload);
    return response.data;
  },

  // Admin promo code CRUD
  adminListPromoCodes: async (params) => {
    const response = await api.get('/admin/promo-codes', { params });
    return response.data;
  },

  adminGetPromoCode: async (promoCodeId) => {
    const response = await api.get(`/admin/promo-codes/${promoCodeId}`);
    return response.data;
  },

  adminCreatePromoCode: async (payload) => {
    const response = await api.post('/admin/promo-codes', payload);
    return response.data;
  },

  adminUpdatePromoCode: async (promoCodeId, payload) => {
    const response = await api.patch(`/admin/promo-codes/${promoCodeId}`, payload);
    return response.data;
  },

  adminDeletePromoCode: async (promoCodeId) => {
    const response = await api.delete(`/admin/promo-codes/${promoCodeId}`);
    return response.data;
  },
};

export default promotionsService;
