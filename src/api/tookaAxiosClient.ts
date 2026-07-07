// tookaAxiosClient.ts

import axios from 'axios';

const tookaAxiosClient = axios.create({
  baseURL: 'https://api.tooka.app/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'Tooka@2026',
  },
});

export default tookaAxiosClient;