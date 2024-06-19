import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosClient } from './lib/axios';
import toast from 'react-hot-toast';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('micro-frontend-user')
      ? JSON.parse(localStorage.getItem('micro-frontend-user'))
      : null
  );
  const [jwt, setJwt] = useState(
    localStorage.getItem('micro-frontend-jwt') || null
  );

  const login = async (email, password) => {
    // Make API call to login
    const response = await axiosClient.post('/api/login', { email, password });
    const { token } = response.data;

    setJwt(token);
    const res = await axiosClient.post('/api/iam', { token });
    setUser(res.data);
    localStorage.setItem('micro-frontend-jwt', token);
    localStorage.setItem('micro-frontend-user', JSON.stringify(res.data));
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem('micro-frontend-jwt');
    localStorage.removeItem('micro-frontend-user');
  };
  const register = async (email, password, name) => {
    try {
      const response = await axiosClient.post('/api/signup', {
        email,
        password,
        name,
      });
      const { token } = response.data;
      setJwt(token);
      const res = await axiosClient.post('/api/iam', { token });
      setUser(res.data);
      localStorage.setItem('micro-frontend-jwt', token);
      localStorage.setItem('micro-frontend-user', JSON.stringify(res.data));
      window.location.href = '/';
    } catch (e) {
      toast.error(e.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
