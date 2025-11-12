import api from "./api";

/**
 * Obtener todas las reseñas aprobadas (públicas)
 * @param {Object} params - Parámetros de consulta (page, limit, rating, sortBy)
 * @returns {Promise<Object>} - { data: [], stats: {}, pagination: {} }
 */
export const obtenerReseñas = async (params = {}) => {
  const { page = 1, limit = 50, rating, sortBy = '-createdAt' } = params;
  
  // Construir query string
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy
  });
  
  if (rating) queryParams.append('rating', rating.toString());
  
  const res = await api.get(`/api/reviews?${queryParams.toString()}`);
  return res.data;
};

/**
 * Obtener una reseña específica por ID
 * @param {string} id - ID de la reseña
 * @returns {Promise<Object>} - Datos de la reseña
 */
export const obtenerReseña = async (id) => {
  const res = await api.get(`/api/reviews/${id}`);
  return res.data?.data || null;
};

/**
 * Crear una nueva reseña
 * @param {Object} reviewData - Datos de la reseña
 * @param {string} reviewData.author - Nombre del autor
 * @param {string} reviewData.email - Email del autor
 * @param {string} reviewData.title - Título de la reseña
 * @param {string} reviewData.content - Contenido de la reseña
 * @param {number} reviewData.rating - Calificación (1-5)
 * @param {string} [reviewData.productId] - ID del producto (opcional)
 * @returns {Promise<Object>} - Reseña creada
 */
export const crearReseña = async (reviewData) => {
  const res = await api.post("/api/reviews", reviewData);
  return res.data;
};

// ========== ADMIN ENDPOINTS (requieren autenticación) ==========

/**
 * Obtener todas las reseñas (incluyendo pendientes) - ADMIN
 * @param {Object} params - Parámetros de consulta (page, limit, status)
 * @returns {Promise<Object>} - { data: [], pagination: {} }
 */
export const obtenerTodasReseñasAdmin = async (params = {}) => {
  const { page = 1, limit = 20, status } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (status) queryParams.append('status', status);
  
  const res = await api.get(`/api/reviews/admin/all?${queryParams.toString()}`);
  return res.data;
};

/**
 * Actualizar estado de una reseña (aprobar/rechazar) - ADMIN
 * @param {string} id - ID de la reseña
 * @param {Object} statusData - Datos de actualización
 * @param {string} statusData.status - Estado (pending, approved, rejected)
 * @param {boolean} [statusData.verified] - Si está verificado
 * @returns {Promise<Object>} - Reseña actualizada
 */
export const actualizarEstadoReseña = async (id, statusData) => {
  const res = await api.put(`/api/reviews/${id}/status`, statusData);
  return res.data;
};

/**
 * Eliminar una reseña - ADMIN
 * @param {string} id - ID de la reseña
 * @returns {Promise<Object>} - Confirmación
 */
export const eliminarReseña = async (id) => {
  const res = await api.delete(`/api/reviews/${id}`);
  return res.data;
};
