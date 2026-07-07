import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authAxiosClient = axios.create({
  baseURL: 'https://api.tooka.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'Tooka@2026',
  },
});

authAxiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[authAxiosClient] Failed to fetch token from storage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.log('[authAxiosClient] API error response =>', error?.response?.data || error);
    }
    return Promise.reject(error);
  }
);

export default authAxiosClient;
