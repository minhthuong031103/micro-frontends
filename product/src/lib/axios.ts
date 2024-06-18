import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://77.37.47.87:8080',
  //   baseURL: 'http://localhost:8080',

  headers: {
    'Content-Type': 'application/json',
  },
});
