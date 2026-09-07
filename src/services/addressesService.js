import api from './api';

const addressesService = {
  listAddresses: async () => {
    const response = await api.get('/users/me/addresses');
    return response.data;
  },

  createAddress: async (payload) => {
    const response = await api.post('/users/me/addresses', payload);
    return response.data;
  },

  updateAddress: async (addressId, payload) => {
    const response = await api.put(`/users/me/addresses/${addressId}`, payload);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/me/addresses/${addressId}`);
    return response.data;
  },

  checkPinServiceability: async (pin) => {
    const response = await api.get('/addresses/serviceability', { params: { pin } });
    return response.data;
  },
};

export default addressesService;
