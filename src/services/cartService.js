import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItemToCart: async (payload) => {
    const response = await api.post('/cart', payload);
    return response.data;
  },

  updateCartItem: async (itemId, payload) => {
    const response = await api.patch(`/cart/items/${itemId}`, payload);
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  applyPromoCode: async (payload) => {
    const response = await api.post('/cart/promo', payload);
    return response.data;
  },

  removePromoCode: async () => {
    const response = await api.delete('/cart/promo');
    return response.data;
  },
};

export default cartService;
