import axios from 'axios';
import { BASE_URL } from './routes';

// Create a configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you need to send cookies with requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Handle unauthorized
        console.error('Authentication failed or expired');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  register: (userData) => api.post('/api/v1/auth/register', userData),
  googleCallback: (code) => api.get(`/api/v1/auth/google/callback?code=${code}`),
};

// User API endpoints
export const userAPI = {
  getMe: () => api.get('/api/v1/users/me'),
  getProfile: () => api.get('/api/v1/users/profile'),
  getUserByEmail: (email) => api.get(`/api/v1/users/by-email?email=${email}`),
  getUserBySlug: (slug) => api.get(`/api/v1/users/${slug}`),
  getMySlug: () => api.get('/api/v1/users/me/slug'),
  checkSlug: (slug) => api.get(`/api/v1/users/check-slug/${slug}`),
  updateSlug: (slug) => api.put('/api/v1/users/me/slug', { slug }),
  getProfileByUserId: (userId) => api.get(`/api/v1/users/${userId}/profile`),
  updateProfile: (profileData) => api.put('/api/v1/users/me/profile', profileData),
  updateContactInfo: (contactData) => api.put('/api/v1/users/me/contact-info', contactData),
  
  // Business card endpoints
  getBusinessCards: () => api.get(`/api/v1/users/${localStorage.getItem('user_id')}/business-cards`),
  getPrimaryBusinessCard: () => api.get(`/api/v1/users/${localStorage.getItem('user_id')}/business-card`),  
  createBusinessCard: (formData) => api.post('/api/v1/users/business-card', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateBusinessCard: (cardId, formData) => api.put(`/api/v1/users/business-card/${cardId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteBusinessCard: (cardId) => api.delete(`/api/v1/users/business-card/${cardId}`),
  setPrimaryBusinessCard: (cardId) => api.put(`/api/v1/users/business-card/${cardId}/set-primary`),
  getBusinessCardBySlug: (slug) => api.get(`/api/v1/users/business-card/${slug}`),
  getQRCode: (params) => api.get('/api/v1/users/me/qrcode', { params }),
  updateQRCode: (data) => api.put('/api/v1/users/me/qrcode', data),
};

// QR Code API endpoints
export const qrCodeAPI = {
  get: (params) => api.get('/api/v1/users/me/qrcode', { params }),

  // Use the base axios instance without auth interceptors for public endpoint
  getPublic: (slug, params) => axios.get(`${BASE_URL}/api/v1/users/${slug}/qrcode`, { params }),

  update: (qrCodeData) => api.put('/api/v1/users/me/qrcode', { qr_data: qrCodeData }),
};

// Export the configured axios instance for custom needs
export default api;