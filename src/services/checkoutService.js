import api from './api';

const checkoutService = {
  initiateCheckout: async (payload) => {
    const response = await api.post('/checkout/initiate', payload);
    return response.data;
  },

  confirmCheckout: async (payload) => {
    const response = await api.post('/checkout/confirm', payload);
    return response.data;
  },
};

export default checkoutService;
