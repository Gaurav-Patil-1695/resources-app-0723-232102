import api from './api';

const usersService = {
  // Current user
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateMe: async (payload) => {
    const response = await api.patch('/users/me', payload);
    return response.data;
  },

  // Admin user management
  adminListUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  adminGetUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  adminCreateUser: async (payload) => {
    const response = await api.post('/admin/users', payload);
    return response.data;
  },

  adminUpdateUser: async (userId, payload) => {
    const response = await api.patch(`/admin/users/${userId}`, payload);
    return response.data;
  },

  adminDeleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

export default usersService;
