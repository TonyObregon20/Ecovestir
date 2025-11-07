import api from "./api";

export const listarProductos = async (id) => {
  if (id) {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  }
  const res = await api.get("/api/products");
  return res.data?.data || [];
};

export const crearProducto = async (producto) => {
  const res = await api.post("/api/products", producto);
  return res.data;
};

export const actualizarProducto = async (id, producto) => {
  const res = await api.put(`/api/products/${id}`, producto);
  return res.data;
};

export const eliminarProducto = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};
