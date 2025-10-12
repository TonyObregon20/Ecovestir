// src/api/categories.js

import api from './api';

// Obtener lista de categorías

// Obtener lista de categorías
export const getCategories = async () => {
  const res = await api.get('/api/categories');
  return res.data.data;
};
