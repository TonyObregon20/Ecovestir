import api from './api';

// Obtener lista de categorías
export const getCategories = async () => {
  const res = await api.get('/api/categories');
  return res.data.data;
};

// Crear categoría
export const createCategory = async (category) => {
  const res = await api.post('/api/categories', category);
  return res.data;
};

// Actualizar categoría
export const updateCategory = async (id, category) => {
  const res = await api.put(`/api/categories/${id}`, category);
  return res.data;
};

// Eliminar categoría
export const deleteCategory = async (id) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};
