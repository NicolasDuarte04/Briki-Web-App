import axios from 'axios';
import Constants from 'expo-constants';

// Use a polyfill for AsyncStorage in web environments or when module can't be loaded
const AsyncStorage = {
  getItem: async (key: string) => {
    try {
      // Try to use the actual AsyncStorage if available
      const realAsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await realAsyncStorage.getItem(key);
    } catch (e) {
      // Fallback to localStorage in web or return null in other environments
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      const realAsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await realAsyncStorage.setItem(key, value);
    } catch (e) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    }
  },
  removeItem: async (key: string) => {
    try {
      const realAsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await realAsyncStorage.removeItem(key);
    } catch (e) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  }
};

// Get API URL from app.config.js extra params or use a default
const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://api.briki.insurance';

// Determine if we're running in development mode
const isDevelopment = Constants.expoConfig?.extra?.isDevelopment || 
  process.env.NODE_ENV === 'development';

// Set the API base URL based on environment
const BASE_URL = isDevelopment 
  ? 'http://localhost:5000'  // Development - update this with your local IP if testing on a physical device
  : apiUrl; // Production

console.log('API URL:', BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await AsyncStorage.getItem('@Briki:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error: any) {
      console.error('Error setting auth token:', error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    
    // If unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token on auth error
      await AsyncStorage.removeItem('@Briki:token');
      
      // You could implement token refresh logic here
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);