import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('market_intel_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('market_intel_token');
      if (savedToken) {
        try {
          const res = await getMeApi();
          if (res.success && res.data.user) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('market_intel_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('market_intel_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('market_intel_token', res.data.token);
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerApi(userData);
      if (res.success) {
        if (res.requiresConfirmation || !res.data?.token) {
          return {
            success: true,
            requiresConfirmation: true,
            message: res.message || 'Registration successful! Please check your email to verify your account.'
          };
        }
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('market_intel_token', res.data.token);
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('market_intel_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
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
