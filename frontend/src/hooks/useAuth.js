// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    // Verificar si el usuario es admin
    if (userData.role === 'admin') {
      window.location.href = '/admin'; // Redirigir a admin dashboard
    } else {
      window.location.href = '/'; // Redirigir al inicio
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/'; // Redirigir al inicio
  };

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return { isAuthenticated, user, loading, login, logout, isAdmin };
};