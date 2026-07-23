import api from './api';

const ordersService = {
  // Customer order endpoints
  listOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Admin order endpoints
  adminListOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  adminGetOrder: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  adminUpdateOrderStatus: async (orderId, payload) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, payload);
    return response.data;
  },
};

export default ordersService;
