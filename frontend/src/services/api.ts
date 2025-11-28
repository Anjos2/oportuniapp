import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

// Users
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCV: (file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    return api.post('/users/upload-cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getProfileProgress: () => api.get('/users/profile-progress'),
  getNotifications: (params?: { page?: number; limit?: number }) =>
    api.get('/users/notifications', { params }),
  markNotificationRead: (id: number) =>
    api.put(`/users/notifications/${id}/read`),
  markAllNotificationsRead: () =>
    api.put('/users/notifications/read-all'),
};

// Opportunities
export const opportunityApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: number;
    modality?: string;
    search?: string;
    sort?: string;
  }) => api.get('/opportunities', { params }),
  getById: (id: number) => api.get(`/opportunities/${id}`),
  getFeatured: (limit?: number) =>
    api.get('/opportunities/featured', { params: { limit } }),
  getSimilar: (id: number, limit?: number) =>
    api.get(`/opportunities/${id}/similar`, { params: { limit } }),
  create: (data: any, attachment?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    if (attachment) {
      formData.append('attachment', attachment);
    }
    return api.post('/opportunities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: number, data: any, attachment?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    if (attachment) {
      formData.append('attachment', attachment);
    }
    return api.put(`/opportunities/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/opportunities/${id}`),
  save: (id: number) => api.post(`/opportunities/${id}/save`),
  unsave: (id: number) => api.delete(`/opportunities/${id}/save`),
  getSaved: (params?: { page?: number; limit?: number }) =>
    api.get('/opportunities/saved', { params }),
};

// Applications
export const applicationApi = {
  create: (opportunityId: number, data?: { cover_letter?: string }) =>
    api.post(`/applications/${opportunityId}`, data),
  getMy: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/applications/my', { params }),
  getReceived: (opportunityId: number, params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get(`/applications/received/${opportunityId}`, { params }),
  updateStatus: (id: number, data: { status: string; publisher_notes?: string }) =>
    api.put(`/applications/${id}/status`, data),
  withdraw: (id: number) => api.delete(`/applications/${id}/withdraw`),
  export: (opportunityId: number) =>
    api.get(`/applications/export/${opportunityId}`, { responseType: 'blob' }),
};

// Publications (for publishers)
export const publicationApi = {
  getMy: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/my-publications', { params }),
  getById: (id: number) => api.get(`/my-publications/${id}`),
  getApplications: (id: number, params?: { page?: number; limit?: number; status?: string }) =>
    api.get(`/my-publications/${id}/applications`, { params }),
  getStats: (id: number) => api.get(`/my-publications/${id}/stats`),
  updateStatus: (id: number, status: string) =>
    api.put(`/my-publications/${id}/status`, { status }),
  duplicate: (id: number) => api.post(`/my-publications/${id}/duplicate`),
};

// Reports
export const reportApi = {
  create: (data: { opportunity_id: number; reason: string; comment?: string }) =>
    api.post('/reports', data),
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/reports', { params }),
  getById: (id: number) => api.get(`/reports/${id}`),
  updateStatus: (id: number, data: { status: string; admin_notes?: string; action?: string }) =>
    api.put(`/reports/${id}/status`, data),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPublications: (params?: { page?: number; limit?: number; status?: string; type?: number; search?: string }) =>
    api.get('/admin/publications', { params }),
  updatePublicationStatus: (id: number, data: { status?: string; rejection_reason?: string; is_featured?: boolean }) =>
    api.put(`/admin/publications/${id}/status`, data),
  deletePublication: (id: number) => api.delete(`/admin/publications/${id}`),
  getExternalAccounts: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/external-accounts', { params }),
  createExternalAccount: (data: any) =>
    api.post('/admin/external-accounts', data),
  updateExternalAccountStatus: (id: number, data: { status: string; rejection_reason?: string }) =>
    api.put(`/admin/external-accounts/${id}/status`, data),
  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    api.get('/admin/users', { params }),
  getAuditLog: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/audit-log', { params }),
};

// Catalogs
export const catalogApi = {
  getFaculties: () => api.get('/catalogs/faculties'),
  getSchools: (facultyId?: number) =>
    facultyId ? api.get(`/catalogs/schools/${facultyId}`) : api.get('/catalogs/schools'),
  getSkills: (category?: string) =>
    api.get('/catalogs/skills', { params: { category } }),
  getSkillCategories: () => api.get('/catalogs/skills/categories'),
  getLanguages: () => api.get('/catalogs/languages'),
  getInterests: () => api.get('/catalogs/interests'),
  getOpportunityTypes: () => api.get('/catalogs/opportunity-types'),
  getStatistics: () => api.get('/catalogs/statistics'),
  search: (q: string) => api.get('/catalogs/search', { params: { q } }),
};

export default api;
