import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://uit-realestate.store',
  //   baseURL: 'http://localhost:8080',

  headers: {
    'Content-Type': 'application/json',
  },
});
