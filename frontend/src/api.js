// Base URL del backend.
// - En desarrollo puedes sobreescribir con una variable de entorno Vite: `VITE_API_URL`.
// - Por defecto apunta a http://localhost:4000 (tu backend está escuchando en el puerto 4000).
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
    // Construye la URL completa y hace un fetch GET
    const url = buildUrl(path);
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
    return handleResponse(res);
  },
  post: async (path, body, options = {}) => {
    // POST con body JSON
    const url = buildUrl(path);
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, body: JSON.stringify(body), ...options });
    return handleResponse(res);
  }
};

export default api;
