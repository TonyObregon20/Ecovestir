// src/components/Categories.jsx
import React, { useState, useEffect } from 'react';
import { getCategories } from '../api/categories';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../pages/categories/categoryPage.css';
import '../style/home.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div 
              key={cat._id || index} 
              className="category-card"
              onClick={() => navigate(`/productos?category=${cat._id}`)}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="card-body">
                <div>
                  <h3 className="category-title" style={{ textTransform: 'capitalize' }}>
                    {cat.name}
                  </h3>
                  <p className="count-badge">{cat.productsCount} productos</p>
                  <p className="category-description">{cat.description}</p>
                </div>
                <button className="category-btn">
                  Ver Categoría <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))} 
        </div>
      </div>
    </section>
  );
}
