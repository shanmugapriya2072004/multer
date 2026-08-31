import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user session on initial app render
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem('medivault_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          
          // Verify token validity with backend
          const res = await API.get('/auth/me');
          if (res.data?.success) {
            setUser((prev) => ({
              ...prev,
              user: res.data.data
            }));
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('medivault_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data?.success) {
        const authPayload = {
          token: res.data.token,
          user: res.data.user
        };
        localStorage.setItem('medivault_user', JSON.stringify(authPayload));
        setUser(authPayload);

        // Redirect based on role
        if (res.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data?.success) {
        const authPayload = {
          token: res.data.token,
          user: res.data.user
        };
        localStorage.setItem('medivault_user', JSON.stringify(authPayload));
        setUser(authPayload);
        navigate('/dashboard');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('medivault_user');
    setUser(null);
    navigate('/login');
  };

  // Profile update handler
  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        user: {
          ...prev.user,
          ...updatedFields
        }
      };
      localStorage.setItem('medivault_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};