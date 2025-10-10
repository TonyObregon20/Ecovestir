// src/pages/ProductosPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/Productcard';
import ProductFilters from '../components/ProductFIlters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/api';
import '../style/products.css';

const PRODUCTS_PER_PAGE = 6;

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const q = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
        const cat = selectedCategories.length > 0 ? `&category=${encodeURIComponent(selectedCategories.join(','))}` : "";
        const res = await api.get(`/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}${q}${cat}`);
        const data = res.data && res.data.data ? res.data.data : res.data;
        const meta = res.data && res.data.meta ? res.data.meta : { totalPages: 1, total: data.length };
        if (mounted) {
          setProductos(data.map(mapProductToUI));
          setTotalPages(meta.totalPages || 1);
          setTotalProducts(meta.total || data.length);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("No se pudieron cargar los productos");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [searchQuery, selectedCategories, currentPage]);

  // Filtrado y ordenamiento frontend
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productos.filter(product => {
      // Search filter
      if (searchQuery && !product.nombre.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Price filter
      if (product.precio < priceRange[0] || product.precio > priceRange[1]) {
        return false;
      }
      // Material filter
      if (selectedMaterials.length > 0 && !selectedMaterials.some(mat => product.nombre.toLowerCase().includes(mat.toLowerCase()))) {
        return false;
      }
      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.some(size => product.nombre.includes(size))) {
        return false;
      }
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.precio - b.precio;
        case 'price-high':
          return b.precio - a.precio;
        case 'rating':
          return b.estrellas - a.estrellas;
        case 'name':
          return a.nombre.localeCompare(b.nombre);
        case 'newest':
        default:
          return b.nuevo ? 1 : -1;
      }
    });

    return filtered;
  }, [productos, searchQuery, priceRange, selectedMaterials, selectedSizes, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product) => {
    console.log('Producto seleccionado:', product);
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando productos...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header" style={{ backgroundColor: '#f5f5f5ff', padding: '20px', borderRadius: '8px' }}>
        <h1 className="products-title">
          Nuestra Colección Orgánica
        </h1>
        <p className="products-subtitle">
          Descubre nuestra completa gama de ropa sostenible fabricada con materiales 100% orgánicos. 
          Cada prenda está cuidadosamente seleccionada para ofrecer calidad, comodidad y respeto por el medio ambiente.
        </p>
      </div>

      <div className="products-main">
        {/* Sidebar con filtros */}
        <aside className="product-filters-container">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedMaterials={selectedMaterials}
            onMaterialChange={setSelectedMaterials}
            selectedSizes={selectedSizes}
            onSizeChange={setSelectedSizes}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Main content */}
        <main className="products-content">
          {/* Results info */}
          <div className="products-results-info">
            <div>
              <p className="products-results-count">
                Mostrando {filteredAndSortedProducts.length} de {totalProducts} productos
              </p>
              {(selectedCategories.length > 0 || selectedMaterials.length > 0 || selectedSizes.length > 0 || searchQuery) && (
                <div className="products-filters-badges">
                  {searchQuery && (
                    <button className="product-filter-badge">
                      Búsqueda: "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.nombre}
                  price={product.precio}
                  image={product.imagen}
                  rating={product.estrellas}
                  reviews={Math.floor(Math.random() * 100) + 10} // o usa product.reviews si lo tienes
                  isOrganic={product.organico}
                  isNew={product.nuevo}
                  onProductClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="products-no-results">
              <p>
                No se encontraron productos que coincidan con los filtros seleccionados.
              </p>
              <button 
                className="products-no-results-btn"
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function mapProductToUI(p) {
  return {
    id: p._id,
    nombre: p.name,
    precio: p.price,
    imagen: p.images && p.images.length ? p.images[0] : 'https://via.placeholder.com/400x400?text=No+Image',
    estrellas: p.rating || 0,
    nuevo: p.isNew || false,
    organico: p.isOrganic || false,
  };
}

export default ProductosPage;