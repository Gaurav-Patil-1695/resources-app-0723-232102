import api from './api';

const catalogueService = {
  // Product listing
  listProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // PLP filters
  getFilters: async (params) => {
    const response = await api.get('/products/filters', { params });
    return response.data;
  },

  // Product detail
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Categories
  listCategories: async (params) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  // Brands
  listBrands: async (params) => {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  getBrand: async (brandId) => {
    const response = await api.get(`/brands/${brandId}`);
    return response.data;
  },

  // Admin catalogue CRUD
  adminListProducts: async (params) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  adminGetProduct: async (productId) => {
    const response = await api.get(`/admin/products/${productId}`);
    return response.data;
  },

  adminCreateProduct: async (payload) => {
    const response = await api.post('/admin/products', payload);
    return response.data;
  },

  adminUpdateProduct: async (productId, payload) => {
    const response = await api.patch(`/admin/products/${productId}`, payload);
    return response.data;
  },

  adminDeleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  adminListCategories: async (params) => {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  },

  adminCreateCategory: async (payload) => {
    const response = await api.post('/admin/categories', payload);
    return response.data;
  },

  adminUpdateCategory: async (categoryId, payload) => {
    const response = await api.patch(`/admin/categories/${categoryId}`, payload);
    return response.data;
  },

  adminDeleteCategory: async (categoryId) => {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  },

  adminListBrands: async (params) => {
    const response = await api.get('/admin/brands', { params });
    return response.data;
  },

  adminCreateBrand: async (payload) => {
    const response = await api.post('/admin/brands', payload);
    return response.data;
  },

  adminUpdateBrand: async (brandId, payload) => {
    const response = await api.patch(`/admin/brands/${brandId}`, payload);
    return response.data;
  },

  adminDeleteBrand: async (brandId) => {
    const response = await api.delete(`/admin/brands/${brandId}`);
    return response.data;
  },
};

export default catalogueService;
