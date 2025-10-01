// src/api.js
// Base URL del backend.
// - En desarrollo puedes sobreescribir con una variable de entorno Vite: `VITE_API_URL`.
// - Por defecto apunta a http://localhost:4000 (tu backend está escuchando en el puerto 4000).
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Función para obtener el token desde localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

function buildUrl(path) {
  // Si no se proporciona path devolvemos la base
  if (!path) return baseURL;
  // Si path ya es absoluto (http://...) lo devolvemos tal cual
  if (/^https?:\/\//i.test(path)) return path;
  // Aseguramos que la URL quede como baseURL + / + path
  return `${baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function handleResponse(res) {
  // Lee el body según el content-type
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) data = await res.json();
  else data = await res.text();

  // Si el estatus HTTP no es OK lanzamos un error con información útil
  if (!res.ok) {
    const err = new Error(data && data.message ? data.message : `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  // Devolvemos un objeto compatible con lo que esperan los componentes: { data, status }
  return { data, status: res.status };
}

const api = {
  get: async (path, options = {}) => {
    // Obtener token
    const token = getToken();
    // Construir headers
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Construye la URL completa y hace un fetch GET
    const url = buildUrl(path);
    const res = await fetch(url, { 
      method: 'GET', 
      headers: { ...headers, ...(options.headers || {}) }, 
      ...options 
    });
    return handleResponse(res);
  },
  post: async (path, body, options = {}) => {
    // Obtener token
    const token = getToken();
    // Construir headers
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // POST con body JSON
    const url = buildUrl(path);
    const res = await fetch(url, { 
      method: 'POST', 
      headers: { ...headers, ...(options.headers || {}) }, 
      body: JSON.stringify(body), 
      ...options 
    });
    return handleResponse(res);
  },
  put: async (path, body, options = {}) => {
    // Obtener token
    const token = getToken();
    // Construir headers
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // PUT con body JSON
    const url = buildUrl(path);
    const res = await fetch(url, { 
      method: 'PUT', 
      headers: { ...headers, ...(options.headers || {}) }, 
      body: JSON.stringify(body), 
      ...options 
    });
    return handleResponse(res);
  },
  delete: async (path, options = {}) => {
    // Obtener token
    const token = getToken();
    // Construir headers
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // DELETE
    const url = buildUrl(path);
    const res = await fetch(url, { 
      method: 'DELETE', 
      headers: { ...headers, ...(options.headers || {}) }, 
      ...options 
    });
    return handleResponse(res);
  }
};

export default api;