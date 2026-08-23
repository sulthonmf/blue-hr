import axios from 'axios';
import { Platform } from 'react-native';

// Standardize API URL for Expo, Android Emulator (10.0.2.2), and Web/iOS (localhost)
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api/v1' 
  : 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      try {
        const refreshToken = typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem('bluehr_mobile_refresh_token')
          : null;

        if (refreshToken) {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const { token, refreshToken: newRefreshToken, user } = res.data;
          setAuthToken(token);
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('bluehr_mobile_token', token);
            if (newRefreshToken) {
              window.localStorage.setItem('bluehr_mobile_refresh_token', newRefreshToken);
            }
          }
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('bluehr_mobile_token');
          window.localStorage.removeItem('bluehr_mobile_refresh_token');
          window.localStorage.removeItem('bluehr_mobile_user');
        }
      }
    }
    return Promise.reject(error);
  }
);
