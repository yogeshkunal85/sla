import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      if (data && data.error) {
        return Promise.reject(data.error);
      }
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: 'Network error occurred'
    });
  }
);

export default client;