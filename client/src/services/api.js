import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('market_intel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Extract Data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getMeApi = () => api.get('/auth/me');

// Competitor Endpoints
export const getCompetitorsApi = () => api.get('/competitors');
export const getCompetitorByIdApi = (id) => api.get(`/competitors/${id}`);
export const createCompetitorApi = (data) => api.post('/competitors', data);
export const updateCompetitorApi = (id, data) => api.put(`/competitors/${id}`, data);
export const deleteCompetitorApi = (id) => api.delete(`/competitors/${id}`);

// Signal Ingestion
export const ingestSignalApi = (signalData) => api.post('/signals/ingest', signalData);

// AI Strategy Engine
export const generateBattlecardApi = (data) => api.post('/ai/generate-battlecard', data);
export const analyzeAnomalyApi = (data) => api.post('/ai/analyze-anomaly', data);

// System Alerts
export const getAlertsApi = (params) => api.get('/alerts', { params });
export const markAlertReadApi = (id) => api.patch(`/alerts/${id}/read`);
export const createAlertApi = (data) => api.post('/alerts', data);

// Analytics Telemetry
export const getAnalyticsOverviewApi = () => api.get('/analytics/overview');

export default api;
