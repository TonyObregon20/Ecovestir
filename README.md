# Ecovestir

Archivos añadidos por la integración front-back y su propósito:

- `frontend/src/api.js` - Cliente HTTP simple basado en `fetch`. Cambia `VITE_API_URL` en `frontend/.env` si tu backend usa otra URL/puerto.
- `frontend/src/components/Productos.jsx` - Componente de la home que carga productos destacados desde `/api/products?limit=6`.
- `frontend/src/pages/ProductosPage.jsx` - Página de productos con búsqueda, filtros y paginación que consume `/api/products`.

Nota: Si tienes un script `seedProducts.js` para poblar productos en la base de datos, colócalo en `Backend/` y ejecútalo desde esa carpeta. Si no existe, crea productos usando la API de backend o desde la base de datos directamente.