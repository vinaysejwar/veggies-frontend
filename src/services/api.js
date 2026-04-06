import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vvs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vvs_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// Products
export const productsAPI = {
  list: (all) => api.get(`/products${all ? '?all=true' : ''}`),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Customers
export const customersAPI = {
  list: (type) => api.get(`/customers${type ? `?type=${type}` : ''}`),
  get: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  ledger: (id) => api.get(`/customers/${id}/ledger`),
};

// Orders
export const ordersAPI = {
  list: (params) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Stock
export const stockAPI = {
  list: () => api.get('/stock'),
  get: (productId) => api.get(`/stock/${productId}`),
  update: (productId, data) => api.put(`/stock/${productId}`, data),
};

// Ripening
export const ripeningAPI = {
  list: (status) => api.get(`/ripening${status ? `?status=${status}` : ''}`),
  get: (id) => api.get(`/ripening/${id}`),
  create: (data) => api.post('/ripening', data),
  updateStatus: (id, data) => api.put(`/ripening/${id}/status`, data),
};

// Payments
export const paymentsAPI = {
  list: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
};

// Delivery
export const deliveryAPI = {
  list: (status) => api.get(`/delivery${status ? `?status=${status}` : ''}`),
  create: (data) => api.post('/delivery', data),
  updateStatus: (id, data) => api.put(`/delivery/${id}/status`, data),
};

// Daily Rates
export const dailyRatesAPI = {
  today: () => api.get('/daily-rates/today'),
  history: (params) => api.get('/daily-rates', { params }),
  set: (data) => api.post('/daily-rates', data),
};

// Reports
export const reportsAPI = {
  dashboard: () => api.get('/reports/dashboard'),
};

export default api;
