
# Ecovestir

Ecovestir es una aplicación fullstack de ejemplo para e-commerce de ropa/accsesorios eco-friendly. Incluye un backend REST en Node/Express con MongoDB (Mongoose) y un frontend en React (Vite) con un carrito, autenticación JWT y panel de administración.

## Contenido de este README
- Resumen del proyecto
- Tecnologías utilizadas
- Estructura del repositorio
- Cómo ejecutar el proyecto en desarrollo
- Variables de entorno necesarias
- Endpoints principales
- Buenas prácticas y notas de seguridad

---

## Resumen rápido
Backend en Node/Express que expone recursos para productos, usuarios, autenticación y administración. Frontend en React (Vite) consume la API y gestiona sesión mediante JWT almacenado en `localStorage`.

## Tecnologías
- Backend: Node.js, Express, Mongoose, JWT, dotenv, Helmet, CORS, Morgan
- Frontend: React, Vite, react-router-dom
- Base de datos: MongoDB (puede usarse Atlas)

## Estructura principal
- `Backend/` - servidor Express, modelos (`Backend/models/`), controladores (`Backend/controllers/`), rutas (`Backend/routes/`) y configuración.
- `frontend/` - aplicación React con componentes, páginas, contexto de carrito y helper HTTP (`frontend/src/api/api.js`).
- `package.json` (raíz) y `README.md` (este archivo).

Algunas rutas y archivos clave:
- `Backend/app.js` - configura middlewares y monta rutas.
- `Backend/server.js` - arranque del servidor y validación de `JWT_SECRET`.
- `Backend/config/db.js` - conexión a MongoDB.
- `Backend/models/Product.js`, `Backend/models/User.js` - modelos principales.
- `frontend/src/App.jsx` - rutas y ProtectedRoute.
- `frontend/src/api/api.js` - helper para llamadas al backend que añade `Authorization` cuando hay token.

## Cómo ejecutar (desarrollo)

1) Backend

```bash
cd Backend
npm install
npm run dev    # arranca con nodemon (server.js)
# si deseas ejecutar en modo producción
npm start
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Nota: el frontend por defecto busca la API en la variable `VITE_API_URL` (si no existe, usa `http://localhost:4000`).

## Scripts útiles (Backend)
- `npm run dev` — arranca `server.js` con `nodemon`.
- `npm start` — arranca con Node.
- `npm run seed` — ejecuta `seeder.js` (si existe) para poblar la base de datos.

## Variables de entorno (mínimas)
Colocar en `Backend/.env` (o en el entorno) estas variables mínimas:

- `MONGO_URI` — URI de conexión a MongoDB.
- `JWT_SECRET` — clave secreta para firmar tokens JWT (OBLIGATORIA; `server.js` aborta si no existe).
- `PORT` — puerto opcional (por defecto 4000).
- `CLIENT_URL` — origen permitido para CORS (por ejemplo `http://localhost:5173`).

En frontend (opcional), en `.env` de Vite:

- `VITE_API_URL` — URL base de la API (ej. `http://localhost:4000`)

Sugerencia: añadir un archivo `Backend/.env.example` y `frontend/.env.example` con estas variables para documentación.

## Endpoints principales
Los endpoints están montados bajo `/api`.

- Productos (`Backend/routes/products.js`):
  - GET `/api/products` — lista paginada, filtros: `q`, `category`, `page`, `limit`, `sort`.
  - GET `/api/products/:id` — obtener producto por id.
  - POST `/api/products` — crear producto (protegido: `protect` + `admin`).
  - PUT `/api/products/:id` — actualizar producto (protegido: admin).
  - DELETE `/api/products/:id` — eliminar producto (protegido: admin).

- Autenticación, usuarios y admin: montados en `/api/auth`, `/api/users`, `/api/admin`.

Nota: en `Backend/app.js` hay un comentario sobre `cartRoutes` y `orderRoutes` — verificar si existen y montarlas si es necesario.

## Notas de seguridad y recomendaciones rápidas
- `JWT_SECRET` nunca debe subirse a repositorio. Usa variables de entorno.
- Por ahora el token se almacena en `localStorage` (vulnerable a XSS). Para producción considera cookies `httpOnly` con `SameSite` y `Secure`.
- Limita `CLIENT_URL` en producción para controlar CORS.
- Revisa si `bcrypt` está en frontend (no debería); el hashing debe ocurrir en backend.

## Buenas prácticas/Mejoras sugeridas
- Añadir `Backend/.env.example` y `frontend/.env.example`.
- Documentar la API (OpenAPI / Postman collection).
- Añadir tests unitarios básicos para controladores y rutas (ej. `productController`).
- Añadir validación centralizada y política de logs para errores críticos.
- Revisar duplicidad de dependencias (`bcrypt` vs `bcryptjs`). Mantener una sola.

## Cómo usar este README como contexto para una IA
Si vas a pasar este repo a otra IA, copia las secciones "Resumen rápido", "Estructura principal", "Variables de entorno" y "Endpoints principales". También incluye `Backend/server.js` y `frontend/src/api/api.js` si vas a pedir cambios en la autenticación o en la configuración de la API.

---

Si quieres, puedo ahora:
- generar `Backend/.env.example` y `frontend/.env.example`,
- revisar si las rutas de carrito y órdenes están implementadas y montadas,
- o crear un archivo `README_CONTEXT.md` más corto para pegar directamente a otra IA.

Indica cuál prefieres que haga a continuación.
 
