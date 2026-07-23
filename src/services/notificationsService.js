import api from './api';

const notificationsService = {
  listNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};

export default notificationsService;
