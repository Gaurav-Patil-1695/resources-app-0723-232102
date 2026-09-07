import api from './api';

const authService = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    const { accessToken, refreshToken } = response.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  forgotPassword: async (payload) => {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
};

export default authService;
