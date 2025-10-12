import React, { useState, useEffect } from 'react';
import './categoryPage.css'; // Asegúrate de que esta ruta sea correcta
import { getCategories } from '../../api/categories'; // Ajusta la ruta según la ubicación de tu archivo categories.js
import '../../style/products.css'; // Header styles from products page
import { Search } from 'lucide-react';

const CategoryPage = () => {
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
    <div className="categorias-container">
      {/* Page Header */}
      <div className="products-header">
        <h1 className="products-title">Nuestras Categorías</h1>
        <p className="products-subtitle">
          Explora nuestra completa colección de ropa orgánica organizada por categorías. Cada prenda está diseñada con materiales sostenibles y fabricada éticamente.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-categories">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar categorías..."
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat._id} className="category-card">
            <img src={cat.image} alt={cat.name} />
            <div className="card-body">
              <div className="category-title">
                {cat.name} <span className="count-badge">{cat.productsCount}</span>
              </div>
              <p className="category-description">{cat.description}</p>
              <p className="materials"><strong>Materiales:</strong> {cat.materials || 'N/A'}</p>
              <p className="price-range"><strong>Rango de precio:</strong> {cat.priceRange || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;