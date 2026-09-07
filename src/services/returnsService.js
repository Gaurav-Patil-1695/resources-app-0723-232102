import api from './api';

const returnsService = {
  // Customer return endpoints
  createReturn: async (orderId, payload) => {
    const response = await api.post(`/orders/${orderId}/returns`, payload);
    return response.data;
  },

  getReturn: async (orderId, returnId) => {
    const response = await api.get(`/orders/${orderId}/returns/${returnId}`);
    return response.data;
  },

  listReturns: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/returns`);
    return response.data;
  },

  // Admin return endpoints
  adminListReturns: async (params) => {
    const response = await api.get('/admin/returns', { params });
    return response.data;
  },

  adminGetReturn: async (returnId) => {
    const response = await api.get(`/admin/returns/${returnId}`);
    return response.data;
  },

  adminUpdateReturn: async (returnId, payload) => {
    const response = await api.patch(`/admin/returns/${returnId}`, payload);
    return response.data;
  },
};

export default returnsService;
