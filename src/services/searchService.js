import api from './api';

const searchService = {
  search: async (params) => {
    const response = await api.get('/search', { params });
    return response.data;
  },

  autocomplete: async (params) => {
    const response = await api.get('/search/autocomplete', { params });
    return response.data;
  },
};

export default searchService;
