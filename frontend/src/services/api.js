import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_AUTH = import.meta.env.VITE_API_AUTH || '';

const apiConfig = {
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
};

if (API_AUTH) {
  apiConfig.headers['X-Tunnel-Auth'] = `Basic ${btoa(API_AUTH)}`;
  apiConfig.auth = { username: API_AUTH.split(':')[0], password: API_AUTH.split(':')[1] };
}

const api = axios.create(apiConfig);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export const countryAPI = {
  list: () => api.get('/countries'),
  get: (code) => api.get(`/countries/${code}`),
  guide: (code) => api.get(`/countries/${code}/guide`),
};

export const universityAPI = {
  list: (params) => api.get('/universities', { params }),
  get: (id) => api.get(`/universities/${id}`),
};

export const eligibilityAPI = {
  check: (countryCode) => api.get('/eligibility/check', { params: { country: countryCode } }),
  checkAll: () => api.get('/eligibility/check'),
};

export const recommendationAPI = {
  get: () => api.get('/recommendations'),
};

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  getCountries: () => api.get('/admin/countries'),
  createCountry: (data) => api.post('/admin/countries', data),
  updateCountry: (id, data) => api.put(`/admin/countries/${id}`, data),
  deleteCountry: (id) => api.delete(`/admin/countries/${id}`),
  getUniversities: () => api.get('/admin/universities'),
  createUniversity: (data) => api.post('/admin/universities', data),
  updateUniversity: (id, data) => api.put(`/admin/universities/${id}`, data),
  deleteUniversity: (id) => api.delete(`/admin/universities/${id}`),
  getUsers: () => api.get('/admin/users'),
};

export const siteConfigAPI = {
  get: () => api.get('/siteconfig'),
  update: (data) => api.put('/siteconfig', data),
  getThemes: () => api.get('/siteconfig/themes'),
  getTheme: (id) => api.get(`/siteconfig/themes/${id}`),
  createTheme: (data) => api.post('/siteconfig/themes', data),
  updateTheme: (id, data) => api.put(`/siteconfig/themes/${id}`, data),
  deleteTheme: (id) => api.delete(`/siteconfig/themes/${id}`),
  activateTheme: (id) => api.post(`/siteconfig/themes/${id}/activate`),
  uploadLogo: (formData) => api.post('/upload/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
