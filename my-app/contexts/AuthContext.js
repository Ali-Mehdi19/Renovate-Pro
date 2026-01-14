'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Create Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user data exists in localStorage on initial load
    const checkAuth = () => {
      try {
        // Try to get user data from localStorage
        const storedUser = localStorage.getItem('renovatepro_user');
        
        if (storedUser) {
          // Safely parse the JSON
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('renovatepro_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      // Store user data in localStorage
      localStorage.setItem('renovatepro_user', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const register = (userData) => {
    try {
      // Store user data in localStorage
      localStorage.setItem('renovatepro_user', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const logout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('renovatepro_user');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};