// src/components/Productos.jsx

import ProductCard from "../components/Productcard";
import { useEffect, useState } from "react";
import api from "../api/api";
import "../style/products.css";

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

  if (loading) return <p className="productos-loading">Cargando productos...</p>;
  if (error) return <p className="productos-error">{error}</p>;

  return (
    <section className="productos-section">
      <div className="productos-container">
        <h2 className="productos-title">Productos Destacados</h2>
        
        {/* Texto descriptivo */}
        <p className="productos-description">
          Descubre nuestra selección cuidadosamente elegida de prendas orgánicas. Cada producto está fabricado con los más altos estándares de sostenibilidad.
        </p>

        <div className="productos-grid">
          {productos.slice(0, 4).map((p) => (
            <ProductCard
              key={p._id}
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
          ))}
        </div>

        <button
          className="productos-ver-todos-btn"
          onClick={() => window.location.href = '/productos'}
        >
          Ver Todos los Productos
        </button>
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
    estrellas: p.rating || 4,
  };
}