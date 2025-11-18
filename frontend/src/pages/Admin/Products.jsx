// src/pages/Admin/Products.jsx
import { useEffect, useState, useRef } from "react";
import { AiFillStar } from 'react-icons/ai';
import { Edit, Trash2 } from 'lucide-react';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../api/products";
import FormularioProducto from "../../components/FormularioProducto";
import { getCategories } from "../../api/categories";

export default function GestionarProductos() {
  // ESTADO: Lista de productos del backend
  const [productos, setProductos] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef(null);
  // ESTADO: Producto en edición (null = no hay edición)
  const [modoEdicion, setModoEdicion] = useState(null);
  // ESTADO: Mostrar/ocultar formulario de creación/edición
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // ESTADO: Mapa de IDs de categorías a nombres (para mostrar en tabla)
  const [categoriesMap, setCategoriesMap] = useState({});

  // EFECTO: Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // FUNCIÓN: Obtener todos los productos del backend
  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
      setDisplayed(data);
    } catch (error) {
      console.error("Error al listar productos:", error);
    }
  };

  // EFECTO: Cargar categorías para mostrar nombres en vez de ObjectIds
  useEffect(() => {
    let mounted = true;
    const loadCats = async () => {
      try {
        const cats = await getCategories();
        if (!mounted) return;
        // CONVERSIÓN: Crear objeto {id: nombre} para lookup rápido
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

  // Debounce search and filter displayed products client-side
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const term = (searchTerm || "").trim().toLowerCase();
      if (!term) {
        setDisplayed(productos);
        return;
      }
      const filtered = (productos || []).filter((p) => {
        const name = (p.name || "").toLowerCase();
        const material = (p.material || "").toLowerCase();
        let catName = "";
        if (p.category) {
          if (typeof p.category === 'object') catName = (p.category.name || "").toLowerCase();
          else catName = (categoriesMap[p.category] || "").toLowerCase();
        }
        return (
          name.includes(term) ||
          material.includes(term) ||
          catName.includes(term) ||
          (p._id || "").toLowerCase().includes(term)
        );
      });
      setDisplayed(filtered);
    }, 220);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, productos, categoriesMap]);

  // MANEJADOR: Crear nuevo producto
  const handleCrear = async (producto) => {
    try {
      await crearProducto(producto);
      setMostrarFormulario(false);
      cargarProductos(); // Recargar lista después de crear
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  // MANEJADOR: Actualizar producto existente
  const handleEditar = async (id, producto) => {
    try {
      await actualizarProducto(id, producto);
      setModoEdicion(null);
      setMostrarFormulario(false);
      cargarProductos(); // Recargar lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  // MANEJADOR: Eliminar producto con confirmación
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      cargarProductos(); // Recargar lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // MÉTRICAS: Calcular estadísticas para las tarjetas de resumen
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.isActive).length;
  
  // FUNCIÓN: Calcular stock total de un producto sumando todas las tallas
  const calcularStockTotal = (p) => {
    if (p.sizeStock && p.sizeStock.length > 0) {
      return p.sizeStock.reduce((sum, item) => sum + (item.stock || 0), 0);
    }
    return 0;
  };
  
  // MÉTRICAS: Productos sin stock y con stock bajo
  const sinStock = productos.filter(p => calcularStockTotal(p) === 0).length;
  const stockBajo = productos.filter(p => {
    const total = calcularStockTotal(p);
    return total > 0 && total <= 10; // Stock bajo = entre 1 y 10 unidades
  }).length;

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
          <div className="card-indicator dot-neutral" />
          <h3>Total Productos</h3>
          <span>{totalProductos}</span>
          <small>+2 desde el mes pasado</small>
        </div>
        <div className="summary-card">
          <div className="card-indicator dot-ok" />
          <h3>Productos Activos</h3>
          <span>{productosActivos}</span>
          <small>{totalProductos ? Math.round((productosActivos / totalProductos) * 100) : 0}% del total</small>
        </div>
        <div className="summary-card">
          <div className="card-indicator dot-out" />
          <h3>Sin Stock</h3>
          <span>{sinStock}</span>
          <small>Requieren reabastecimiento</small>
        </div>
        <div className="summary-card">
          <div className="card-indicator dot-low" />
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario (modal) */}
      {mostrarFormulario && (
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
            {displayed.map((p) => (
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
                    <AiFillStar size={14} style={{ color: '#f59e0b' }} />
                    <strong style={{ marginLeft: 6 }}>{p.rating || 0}</strong>
                    <span style={{ marginLeft: 8, color: '#6b7280', fontSize: '0.9rem' }}>({p.reviews || 0} reseñas)</span>
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
                  {/* COLUMNA STOCK: Mostrar stock por talla */}
                  {(() => {
                    const totalStock = calcularStockTotal(p);
                    const stockItems = p.sizeStock?.filter(item => item.stock > 0) || [];
                    
                    return (
                      <div className="stock-by-size">
                        {/* BADGES: Una insignia por cada talla con stock */}
                        {stockItems.map((item, idx) => (
                          <span 
                            key={idx} 
                            className={`size-badge ${item.stock === 0 ? 'out' : item.stock <= 5 ? 'low' : 'ok'}`}
                          >
                            {item.size}: {item.stock}
                          </span>
                        ))}
                        {/* SIN STOCK: Mostrar mensaje si no hay stock en ninguna talla */}
                        {stockItems.length === 0 && <span className="size-badge out">Sin stock</span>}
                        {/* TOTAL: Mostrar punto de color y total en formato grande */}
                        <div style={{ marginTop: 8 }}>
                          <span className={`stock-dot ${totalStock === 0 ? 'out' : totalStock <= 10 ? 'low' : 'ok'}`}></span>
                          <span className="stock-display">{totalStock} unidades</span>
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td>
                  <span className={`status ${p.isActive ? "active" : "inactive"}`}>
                    {p.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn-outline admin-btn-sm edit"
                    aria-label="Editar producto"
                    onClick={() => {
                      setModoEdicion(p);
                      setMostrarFormulario(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="admin-btn admin-btn-outline admin-btn-sm delete"
                    aria-label="Eliminar producto"
                    onClick={() => handleEliminar(p._id)}
                  >
                    <Trash2 className="w-4 h-4" />
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