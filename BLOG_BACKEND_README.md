# Sistema de Reseñas - Blog

Backend completo para el sistema de reseñas del blog de EcoVestir.

## 📁 Archivos Creados

### Backend
- ✅ `Backend/models/Review.js` - Modelo de Mongoose para reseñas
- ✅ `Backend/controllers/reviewController.js` - Controladores para las operaciones CRUD
- ✅ `Backend/routes/reviews.js` - Rutas de la API
- ✅ `Backend/seedReviews.js` - Script para crear reseñas de ejemplo
- ✅ `Backend/app.js` - Actualizado para incluir rutas de reviews

### Frontend
- ✅ `frontend/src/pages/Blog.jsx` - Actualizado para usar el backend real

## 🚀 Cómo usar

### 1. Iniciar el Backend

```bash
cd Backend
npm start
```

### 2. (Opcional) Crear reseñas de ejemplo

```bash
cd Backend
node seedReviews.js
```

Esto creará 6 reseñas de ejemplo aprobadas para que puedas ver el sistema funcionando.

### 3. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

### Públicos

- **GET** `/api/reviews` - Obtener todas las reseñas aprobadas
  - Query params: `page`, `limit`, `rating`, `sortBy`
  - Ejemplo: `/api/reviews?limit=50`

- **GET** `/api/reviews/:id` - Obtener una reseña específica

- **POST** `/api/reviews` - Crear nueva reseña
  ```json
  {
    "author": "Nombre del autor",
    "email": "email@example.com",
    "title": "Título de la reseña",
    "content": "Contenido de la reseña",
    "rating": 5,
    "productId": "id_del_producto (opcional)"
  }
  ```

### Admin (requieren autenticación)

- **GET** `/api/reviews/admin/all` - Obtener todas las reseñas (incluyendo pendientes)
- **PUT** `/api/reviews/:id/status` - Aprobar/rechazar reseña
- **DELETE** `/api/reviews/:id` - Eliminar reseña

## 🔒 Sistema de Moderación

Todas las reseñas nuevas tienen estado `pending` por defecto y deben ser aprobadas por un admin antes de ser visibles públicamente.

### Estados de reseña:
- `pending` - Pendiente de revisión
- `approved` - Aprobada y visible
- `rejected` - Rechazada

## 📊 Modelo de Datos

```javascript
{
  author: String,           // Nombre del autor (requerido)
  email: String,            // Email (requerido, no se muestra públicamente)
  title: String,            // Título de la reseña (requerido)
  content: String,          // Contenido (requerido, 10-2000 caracteres)
  rating: Number,           // Calificación 1-5 (requerido)
  product: ObjectId,        // Referencia a producto (opcional)
  productName: String,      // Nombre del producto (opcional)
  productImage: String,     // Imagen del producto (opcional)
  verified: Boolean,        // Si el usuario está verificado
  status: String,           // pending/approved/rejected
  meta: {
    ip: String,             // IP del usuario
    userAgent: String       // User agent
  },
  createdAt: Date,          // Fecha de creación
  updatedAt: Date           // Última actualización
}
```

## 🎨 Frontend

El componente `Blog.jsx` ahora:
- ✅ Carga reseñas del backend al montar
- ✅ Muestra estado de carga
- ✅ Envía nuevas reseñas al backend
- ✅ Muestra estadísticas reales (promedio y total)
- ✅ Deshabilita formulario mientras envía
- ✅ Formatea fechas correctamente
- ✅ Muestra badge de verificado
- ✅ Muestra productos relacionados (si existen)

## 🔧 Próximas Mejoras (Opcionales)

1. **Rate Limiting**: Limitar número de reseñas por IP/usuario
2. **Validación avanzada**: Anti-spam, palabras prohibidas
3. **Paginación en frontend**: Cargar más reseñas al hacer scroll
4. **Filtros**: Por calificación, fecha, producto
5. **reCAPTCHA**: Protección contra bots
6. **Notificaciones**: Email al admin cuando hay nueva reseña
7. **Likes/Helpful**: Permitir marcar reseñas como útiles

## ✅ Testing

Puedes probar el sistema:

1. Visita http://localhost:5173/blog
2. Llena el formulario y envía una reseña
3. La reseña se guardará con estado `pending`
4. Usa Postman o el panel admin para aprobarla
5. Recarga la página para verla publicada

## 🐛 Troubleshooting

- **No se cargan las reseñas**: Verifica que el backend esté corriendo y la conexión a MongoDB esté activa
- **Las reseñas no aparecen**: Las nuevas reseñas requieren aprobación por admin (status: 'approved')
- **Error al enviar**: Revisa la consola del navegador y los logs del backend
