// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       // Clear storage and redirect to login
//       localStorage.clear();
//       window.location.href = '/login';
//     }
    
//     return Promise.reject(error);
//   }
// );

// export const authAPI = {
//   login: (credentials) => api.post('/auth/login', credentials),
//   logout: () => api.post('/auth/logout'),
//   getProfile: () => api.get('/auth/profile')
// };

// export const userAPI = {
//   createUser: (userData) => api.post('/users', userData),
//   getUsers: (params) => api.get('/users', { params }),
//   updateUser: (id, updates) => api.put(`/users/${id}`, updates),
//   deleteUser: (id) => api.delete(`/users/${id}`),
//   getUserActivity: (userId, params) => api.get(`/users/${userId}/activity`, { params })
// };

// export const leadAPI = {
//   createLead: (leadData) => api.post('/leads', leadData),
//   getLeads: (params) => api.get('/leads', { params }),
//   updateLead: (id, updates) => api.put(`/leads/${id}`, updates),
//   importLeads: (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/leads/import', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
//   exportLeads: (params) => api.get('/leads/export', { 
//     params,
//     responseType: 'blob'
//   })
// };

// export const dashboardAPI = {
//   getStats: () => api.get('/dashboard/stats')
// };

// export default api;











import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear storage and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

export const userAPI = {
  createUser: (userData) => api.post('/users', userData),
  getUsers: (params) => api.get('/users', { params }),
  updateUser: (id, updates) => api.put(`/users/${id}`, updates),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserActivity: (userId, params) => api.get(`/users/${userId}/activity`, { params })
};

export const leadAPI = {
  createLead: (leadData) => api.post('/leads', leadData),
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  updateLead: (id, updates) => api.put(`/leads/${id}`, updates),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  importLeads: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/leads/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  exportLeads: (params) => api.get('/leads/export', { 
    params,
    responseType: 'blob'
  })
};

export const tagAPI = {
  getAllTags: () => api.get('/tags'),
  updateLeadTags: (id, data) => api.put(`/tags/${id}`, data),
  getLeadsByTag: (tag, params) => api.get(`/tags/${tag}/leads`, { params })
};

export const noteAPI = {
  addNote: (leadId, data) => api.post(`/notes/${leadId}/notes`, data),
  updateNote: (leadId, noteId, data) => api.put(`/notes/${leadId}/notes/${noteId}`, data),
  deleteNote: (leadId, noteId) => api.delete(`/notes/${leadId}/notes/${noteId}`),
  getLeadNotes: (leadId) => api.get(`/notes/${leadId}/notes`)
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats')
};

export default api;