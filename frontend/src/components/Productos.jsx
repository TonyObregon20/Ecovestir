// Componente Productos
// - Muestra una selección de productos destacados en la página principal.
// - Obtiene datos del backend mediante el cliente `api` (frontend/src/api.js).
// - Maneja estados: loading, error y mapea el shape del backend al shape de la UI.
// - Si el backend no responde verás el mensaje de error en la UI.
// Nota: este componente hace una petición GET a `/api/products?limit=6`.
import ProductCard from "./Productcard";
import { useEffect, useState } from "react";
import api from "../api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/products?limit=6');
        const data = res.data && res.data.data ? res.data.data : res.data;
        if (mounted) setProductos(data.map(mapProductToUI));
      } catch (err) {
        console.error(err);
        if (mounted) setError('No se pudieron cargar los productos');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando productos...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <section style={{ padding: "50px 20px", backgroundColor: "var(--blanco)" }}>
      <div className="container">
        <h2
          style={{
            color: "var(--verde-primario)",
            fontSize: "2rem",
            marginBottom: "20px",
          }}
        >
          Productos Destacados
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {productos.slice(0, 2).map((p) => (
            <ProductCard key={p._id} producto={p} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <a href="/productos">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                backgroundColor: "var(--verde-primario)",
                color: "var(--blanco)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ver Todos los Productos
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

function mapProductToUI(p) {
  return {
    _id: p._id,
    nombre: p.name,
    descripcion: p.description || '',
    precio: p.price,
    imagen: p.images && p.images.length ? p.images[0] : 'https://via.placeholder.com/400x400?text=No+Image',
    nuevo: false,
    organico: p.ecoFriendly || false,
    estrellas: 4,
  };
}
