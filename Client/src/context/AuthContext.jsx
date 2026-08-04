import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/profile');
          setUser({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone || '',
            address: data.address || '',
            avatar: data.avatar || '/avatars/nobita.png',
          });
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // If OTP verification is required
      if (data.verified === false) {
        return {
          success: false,
          requiresVerification: true,
          email: data.email,
          message: data.message
        };
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '/avatars/nobita.png',
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
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

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      
      // Registration successfully saved, but requires OTP verify
      if (data.verified === false) {
        return {
          success: false,
          requiresVerification: true,
          email: data.email,
          message: data.message
        };
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '/avatars/nobita.png',
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '/avatars/nobita.png',
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend OTP',
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '/avatars/nobita.png',
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        updateProfile,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
