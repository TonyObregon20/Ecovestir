// src/components/Productos.jsx
import ProductCard from "./Productcard";
import { useEffect, useState } from "react";
import api from "../api/api";

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
            marginBottom: "8px",
            textAlign: "center"
          }}
        >
          Productos Destacados
        </h2>
        
        {/* Texto descriptivo */}
        <p style={{
          color: "var(--gris-medio)",
          fontSize: "1rem",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "normal",
          maxWidth: "800px",
          margin: "0 auto 20px auto"
        }}>
          Descubre nuestra selección cuidadosamente elegida de prendas orgánicas. Cada producto está fabricado con los más altos estándares de sostenibilidad.
        </p>

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "20px", 
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {productos.slice(0, 4).map((p) => (
            <div key={p._id} style={{ 
              flex: "1 1 280px", 
              maxWidth: "280px", 
              minWidth: "250px",
              position: "relative"
            }}>
              {/* Enviar producto en el formato que espera ProductCard */}
              <ProductCard 
                id={p._id}
                name={p.nombre}
                price={p.precio}
                image={p.imagen}
                rating={p.estrellas}
                reviews={Math.floor(Math.random() * 100) + 10}
                isOrganic={p.organico}
                isNew={p.nuevo}
                onProductClick={() => console.log('Producto seleccionado:', p)}
              />
            </div>
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
                fontSize: "16px",
                fontWeight: "500"
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
    estrellas: p.rating || 4, // Aseguramos que rating sea un número
  };
}