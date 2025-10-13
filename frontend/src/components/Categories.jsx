// src/components/Categories.jsx
import React, { useState, useEffect } from 'react';
import { getCategories } from '../api/categories';
import { Link } from 'react-router-dom';
import '../style/home.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p style={{ padding: 20, textAlign: 'center' }}>Cargando categorías...</p>;

  return (
    <section className="categorias-section">
      <div className="categorias-container">
        <h2 className="categorias-title">Nuestras Categorías</h2>
        <p className="categorias-subtitle">
          Explora nuestra amplia gama de categorías de ropa orgánica. Desde casual hasta formal, tenemos todo lo que necesitas.
        </p>
        <div className="categorias-grid">
          {categories.map((cat, index) => (
            <div key={cat._id || index} className="categoria-card">
              <img src={cat.image} alt={cat.name} className="categoria-image" />
              <div className="categoria-content">
                <h3 className="categoria-name">{cat.name}</h3>
                <p className="categoria-description">{cat.description}</p>
                <p className="categoria-products">{cat.productsCount} productos</p>
                <Link to="/categorias" className="categoria-btn">
                  Ver Categoría →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
