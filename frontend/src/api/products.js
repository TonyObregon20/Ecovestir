import api from "./api"; // usa tu api.js


// Listar productos
export const listarProductos = async () => {
  const res = await api.get("/api/products");
  // ⚡ tu backend devuelve { data: [...] }, entonces devolvemos SOLO el array
  return res.data.data;
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
// Obtener un producto por ID
export const getProduct = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};
