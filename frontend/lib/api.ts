import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API functions

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }),

  signup: (email: string, password: string, full_name?: string) =>
    api.post('/api/v1/auth/signup', { email, password, full_name }),

  getMe: () => api.get('/api/v1/auth/me'),
};

// Datasets
export const datasetsAPI = {
  list: (page = 1, pageSize = 20) =>
    api.get(`/api/v1/datasets?page=${page}&page_size=${pageSize}`),

  get: (id: number) => api.get(`/api/v1/datasets/${id}`),

  upload: (formData: FormData) =>
    api.post('/api/v1/datasets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id: number) => api.delete(`/api/v1/datasets/${id}`),
};

// Jobs
export const jobsAPI = {
  list: (page = 1, pageSize = 20, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) params.append('status_filter', status);
    return api.get(`/api/v1/jobs?${params.toString()}`);
  },

  get: (id: number) => api.get(`/api/v1/jobs/${id}`),

  getResults: (id: number) => api.get(`/api/v1/jobs/${id}/results`),

  download: (id: number) =>
    api.get(`/api/v1/jobs/${id}/download`, {
      responseType: 'blob',
    }),

  delete: (id: number) => api.delete(`/api/v1/jobs/${id}`),
};

// Analysis
export const analysisAPI = {
  createPCA: (datasetId: number, name: string, parameters?: any) =>
    api.post('/api/v1/analysis/pca', {
      name,
      dataset_id: datasetId,
      parameters,
    }),

  createClustering: (datasetId: number, name: string, parameters?: any) =>
    api.post('/api/v1/analysis/clustering', {
      name,
      dataset_id: datasetId,
      parameters,
    }),

  createKinship: (datasetId: number, name: string, parameters?: any) =>
    api.post('/api/v1/analysis/kinship', {
      name,
      dataset_id: datasetId,
      parameters,
    }),

  createFullAnalysis: (datasetId: number, name: string, parameters?: any) =>
    api.post('/api/v1/analysis/full', {
      name,
      dataset_id: datasetId,
      parameters,
    }),
};

export default api;
