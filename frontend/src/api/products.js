// src/api/products.js
import api from "./api";

// Listar productos o obtener producto por id
// Si se pasa un id, hace GET /api/products/:id y devuelve el objeto
// Si no se pasa id, hace GET /api/products y devuelve el array de productos
export const listarProductos = async (id) => {
  if (id) {
    const res = await api.get(`/api/products/${id}`);
    // El backend devuelve el objeto del producto
    return res.data;
  }

  const res = await api.get("/api/products");
  // Asegúrate de devolver siempre un array
  return res.data?.data || [];
};

// Crear producto
export const crearProducto = async (producto) => {
  const res = await api.post("/api/products", producto);
  return res.data;
};

// Actualizar producto
export const actualizarProducto = async (id, producto) => {
  const res = await api.put(`/api/products/${id}`, producto);
  return res.data;
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};
