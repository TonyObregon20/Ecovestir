// src/api/products.js
import api from "./api";

// Listar productos
export const listarProductos = async () => {
  const res = await api.get("/api/products");
  // ⚠️ Asegúrate de que siempre devuelvas un array
  return res.data?.data || []; // 👈 Si data.data no existe, devuelve []
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