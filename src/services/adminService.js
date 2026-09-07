import api from './api';
import usersService from './usersService';
import catalogueService from './catalogueService';
import ordersService from './ordersService';
import returnsService from './returnsService';
import promotionsService from './promotionsService';

const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Reports
  getSalesReport: async (params) => {
    const response = await api.get('/admin/reports/sales', { params });
    return response.data;
  },

  getOrdersReport: async (params) => {
    const response = await api.get('/admin/reports/orders', { params });
    return response.data;
  },

  getRevenueReport: async (params) => {
    const response = await api.get('/admin/reports/revenue', { params });
    return response.data;
  },

  getUsersReport: async (params) => {
    const response = await api.get('/admin/reports/users', { params });
    return response.data;
  },

  // Delegated domain calls — users
  listUsers: (params) => usersService.adminListUsers(params),
  getUser: (userId) => usersService.adminGetUser(userId),
  createUser: (payload) => usersService.adminCreateUser(payload),
  updateUser: (userId, payload) => usersService.adminUpdateUser(userId, payload),
  deleteUser: (userId) => usersService.adminDeleteUser(userId),

  // Delegated domain calls — catalogue
  listProducts: (params) => catalogueService.adminListProducts(params),
  getProduct: (productId) => catalogueService.adminGetProduct(productId),
  createProduct: (payload) => catalogueService.adminCreateProduct(payload),
  updateProduct: (productId, payload) => catalogueService.adminUpdateProduct(productId, payload),
  deleteProduct: (productId) => catalogueService.adminDeleteProduct(productId),
  listCategories: (params) => catalogueService.adminListCategories(params),
  createCategory: (payload) => catalogueService.adminCreateCategory(payload),
  updateCategory: (categoryId, payload) => catalogueService.adminUpdateCategory(categoryId, payload),
  deleteCategory: (categoryId) => catalogueService.adminDeleteCategory(categoryId),
  listBrands: (params) => catalogueService.adminListBrands(params),
  createBrand: (payload) => catalogueService.adminCreateBrand(payload),
  updateBrand: (brandId, payload) => catalogueService.adminUpdateBrand(brandId, payload),
  deleteBrand: (brandId) => catalogueService.adminDeleteBrand(brandId),

  // Delegated domain calls — orders
  listOrders: (params) => ordersService.adminListOrders(params),
  getOrder: (orderId) => ordersService.adminGetOrder(orderId),
  updateOrderStatus: (orderId, payload) => ordersService.adminUpdateOrderStatus(orderId, payload),

  // Delegated domain calls — returns
  listReturns: (params) => returnsService.adminListReturns(params),
  getReturn: (returnId) => returnsService.adminGetReturn(returnId),
  updateReturn: (returnId, payload) => returnsService.adminUpdateReturn(returnId, payload),

  // Delegated domain calls — promotions
  listPromoCodes: (params) => promotionsService.adminListPromoCodes(params),
  getPromoCode: (promoCodeId) => promotionsService.adminGetPromoCode(promoCodeId),
  createPromoCode: (payload) => promotionsService.adminCreatePromoCode(payload),
  updatePromoCode: (promoCodeId, payload) => promotionsService.adminUpdatePromoCode(promoCodeId, payload),
  deletePromoCode: (promoCodeId) => promotionsService.adminDeletePromoCode(promoCodeId),
};

export default adminService;
