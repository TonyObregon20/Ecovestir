// src/pages/Admin/Products.jsx
import { useEffect, useState } from "react";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../api/products";
import FormularioProducto from "../../components/FormularioProducto";
import { getCategories } from "../../api/categories";

export default function GestionarProductos() {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al listar productos:", error);
    }
  };

  // Cargar categorias para mostrar nombre en la tabla (evitamos mostrar ObjectId)
  useEffect(() => {
    let mounted = true;
    const loadCats = async () => {
      try {
        const cats = await getCategories();
        if (!mounted) return;
        const map = {};
        (cats || []).forEach((c) => {
          if (c && c._id) map[c._id] = c.name || c.title || c._id;
        });
        setCategoriesMap(map);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    loadCats();
    return () => { mounted = false; };
  }, []);

  const handleCrear = async (producto) => {
    try {
      await crearProducto(producto);
      setMostrarFormulario(false);
      cargarProductos();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const handleEditar = async (id, producto) => {
    try {
      await actualizarProducto(id, producto);
      setModoEdicion(null);
      setMostrarFormulario(false);
      cargarProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // 🔹 Métricas para tarjetas de resumen
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.isActive).length;
  const sinStock = productos.filter(p => p.stock === 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="admin-products-container">
      <div className="page-header">
        <div>
          <h1>Gestión de Productos</h1>
          <p>Administra tu inventario de productos orgánicos</p>
        </div>
        <button
          className="add-product-btn"
          onClick={() => {
            setModoEdicion(null);
            setMostrarFormulario(true);
          }}
        >
          + Agregar Producto
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Productos</h3>
          <span>{totalProductos}</span>
          <small>+2 desde el mes pasado</small>
        </div>
        <div className="summary-card">
          <h3>Productos Activos</h3>
          <span>{productosActivos}</span>
          <small>{totalProductos ? Math.round((productosActivos / totalProductos) * 100) : 0}% del total</small>
        </div>
        <div className="summary-card">
          <h3>Sin Stock</h3>
          <span>{sinStock}</span>
          <small>Requieren reabastecimiento</small>
        </div>
        <div className="summary-card">
          <h3>Stock Bajo</h3>
          <span>{stockBajo}</span>
          <small>Menos de 10 unidades</small>
        </div>
      </div>

      {/* Barra de búsqueda (placeholder) */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos por nombre, categoría o material..."
          disabled
        />
      </div>

      {/* Formulario (modal) */}
      {mostrarFormulario && (
        <div className="form-overlay">
          <FormularioProducto
            producto={modoEdicion}
            onSubmit={
              modoEdicion
                ? (prod) => handleEditar(modoEdicion._id, prod)
                : handleCrear
            }
            onCancel={() => {
              setMostrarFormulario(false);
              setModoEdicion(null);
            }}
          />
        </div>
      )}

      {/* Tabla de productos */}
      <div className="scrollable-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Material</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images && p.images.length ? p.images[0] : "https://via.placeholder.com/60"}
                    alt={p.name}
                    className="product-image"
                  />
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <div className="rating">
                    ⭐ {p.rating || 0} ({p.reviews || 0} reseñas)
                  </div>
                </td>
                <td>
                  {(() => {
                    // Mostrar el nombre de la categoría cuando sea posible
                    if (!p.category) return "–";
                    if (typeof p.category === 'object') return p.category.name || p.category._id;
                    return categoriesMap[p.category] || p.category;
                  })()}
                </td>
                <td>
                  <span className="material-tag">
                    {p.material ? p.material : (p.ecoFriendly ? "Algodón Orgánico" : "Convencional")}
                  </span>
                </td>
                <td>
                  ${p.price}
                  {p.originalPrice && p.originalPrice > p.price && (
                    <del style={{ marginLeft: "6px", color: "#999" }}>
                      ${p.originalPrice}
                    </del>
                  )}
                </td>
                <td>
                  <span className={`stock ${p.stock === 0 ? "out" : p.stock <= 10 ? "low" : "ok"}`}>
                    {p.stock} {p.stock === 1 ? "unidad" : "unidades"}
                  </span>
                </td>
                <td>
                  <span className={`status ${p.isActive ? "active" : "inactive"}`}>
                    {p.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setModoEdicion(p);
                      setMostrarFormulario(true);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleEliminar(p._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}