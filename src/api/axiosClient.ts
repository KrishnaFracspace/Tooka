import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://apitest.fracspace.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'Fracspace@2024',
  },
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (__DEV__) {
      console.log('API ERROR =>', error?.response?.data || error);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;