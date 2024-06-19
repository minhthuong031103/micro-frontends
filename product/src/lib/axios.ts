import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://uit-realestate.store',
  //   baseURL: 'http://localhost:8080',

  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('micro-frontend-jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
