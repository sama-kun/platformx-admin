import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth';

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvb3RAZXhhbXBsZS5jb20iLCJpZCI6Miwicm9sZSI6InJvb3QiLCJpYXQiOjE3MTcwNjExNDMsImV4cCI6MTcxNzE0NzU0M30.oK50UGELx2vdl0rlAWgYHDLIjQELt140TjqBfdgafyk';
const axiosInstance = axios.create({
  baseURL: 'http://185.100.67.121:6671/',
  headers: {
    'Content-Type': 'application/json',
    "timeout": 60000,
  },
});
axiosInstance.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 403 && !isRefreshing) {
      isRefreshing = true;
      try {
        const authResponse = await axios.get('http://185.100.67.121:6671/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (authResponse.data.statusCode >= 400 && authResponse.data.statusCode < 500) {
          removeAuthToken();
          window.location.href = '/login';
        }
      } catch (authError) {
        removeAuthToken();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;