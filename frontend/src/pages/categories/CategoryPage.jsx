import React, { useState, useEffect } from 'react';
import './categoryPage.css'; // Asegúrate de que esta ruta sea correcta
import { getCategories } from '../../api/categories'; // Ajusta la ruta según la ubicación de tu archivo categories.js
import '../../style/products.css'; // Header styles from products page
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {filteredCategories.map((cat) => (
          <div 
            key={cat._id} 
            className="category-card"
            onClick={() => navigate(`/productos?category=${cat._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={cat.image} alt={cat.name} />
            <div className="card-body">
              <div className="category-title" style={{ textTransform: 'capitalize' }}>
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