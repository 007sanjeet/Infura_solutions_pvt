import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('infura_token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios defaults on token change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('infura_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('infura_token');
    }
  }, [token]);

  // Load user profile if token is present
  const fetchProfile = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user profile, token might be invalid:', error);
      // Clear token if invalid
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
