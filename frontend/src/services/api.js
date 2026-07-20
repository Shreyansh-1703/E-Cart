import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/users/me'),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartService = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

export const orderService = {
  getAll: (all = false) => api.get(`/orders${all ? '?all=true' : ''}`),
  getById: (id) => api.get(`/orders/${id}`),
  place: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const adminService = {
  getStats: () => api.get('/users/admin/stats'),
  getAllUsers: () => api.get('/users'),
  toggleUser: (id) => api.put(`/users/${id}/toggle`),
};

export const externalService = {
  getFakeStoreProducts: (limit = 20) => axios.get(`https://fakestoreapi.com/products?limit=${limit}`).then(res => res.data),
  getWeather: (lat = 28.6139, lon = 77.2090) => axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`).then(res => res.data),
};

export const vendorService = {
  getAll: (category) => api.get('/vendors', { params: { category } }),
  getById: (id) => api.get(`/vendors/${id}`),
  register: (data) => api.post('/vendors/register', data),
  getPending: () => api.get('/vendors/pending'),
  approve: (id) => api.post(`/vendors/${id}/approve`),
  reject: (id) => api.post(`/vendors/${id}/reject`),
};

export const vendorBookingService = {
  create: (data) => api.post('/vendor-bookings', data),
  getUserBookings: (userId) => api.get(`/vendor-bookings/user/${userId}`),
  getVendorBookings: (vendorId) => api.get(`/vendor-bookings/vendor/${vendorId}`),
  updateStatus: (id, status) => api.patch(`/vendor-bookings/${id}/status`, null, { params: { status } }),
};

export const wishlistService = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  count: () => api.get('/wishlist/count'),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

export const reviewService = {
  getByProduct: (productId, page = 0, size = 10) =>
    api.get(`/products/${productId}/reviews`, { params: { page, size } }),
  getSummary: (productId) => api.get(`/products/${productId}/reviews/summary`),
  add: (productId, review) => api.post(`/products/${productId}/reviews`, review),
};

export const returnService = {
  getMyReturns: () => api.get('/returns'),
  create: (data) => api.post('/returns', data),
  getPolicy: (productId) => api.get(`/returns/policy/${productId}`),
  checkPin: (pincode) => api.get(`/returns/delivery/pin/${pincode}`),
};

export const recommendationService = {
  getFrequentlyBought: (productId, limit = 5) =>
    api.get(`/products/${productId}/recommendations`, { params: { type: 'frequently_bought', limit } }),
  getAlsoBought: (productId, limit = 6) =>
    api.get(`/products/${productId}/recommendations`, { params: { type: 'also_bought', limit } }),
};

export const paymentService = {
  createOrder: (orderId) => api.post('/payment/create-order', { orderId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

export const sellerService = {
  register: (data) => api.post('/seller/register', data),
  getMe: () => api.get('/seller/me'),
  getStats: () => api.get('/seller/stats'),
  getPending: () => api.get('/seller/pending'),
  approve: (id) => api.post(`/seller/${id}/approve`),
  reject: (id) => api.post(`/seller/${id}/reject`),
};
