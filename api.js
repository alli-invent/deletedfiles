import axios from 'axios';

// Create axios instance with base URL from current subdomain
const createApiInstance = () => {
  const baseURL = getApiBaseUrl();

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include tenant context
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const getApiBaseUrl = () => {
  const host = window.location.hostname;
  const parts = host.split('.');

  if (parts.length > 2 && parts[0] !== 'www') {
    // Tenant-specific subdomain
    return `https://${host}/api`;
  }

  // Main domain
  return 'https://xyz.com/api';
};

const api = createApiInstance();

export default api;
