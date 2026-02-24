import axios from 'axios';

// In development: Vite proxy rewrites /api → http://localhost:5000/api
// In production (Netlify): VITE_API_URL must point to your deployed backend
//   e.g. https://your-backend.onrender.com
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Don't redirect if the error comes from a login attempt (wrong credentials)
      const isLoginRequest = err.config.url.includes('/auth/admin-login') ||
        err.config.url.includes('/auth/customer-login') ||
        err.config.url.includes('/auth/google');

      if (!isLoginRequest) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;