import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/profile');
          if (data.role === 'admin') {
            setAdmin(data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to fetch admin profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchAdminProfile();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.role !== 'admin') {
        return { success: false, message: 'Access denied: not an admin user' };
      }
      setAdmin({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken('');
    localStorage.removeItem('admin_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
