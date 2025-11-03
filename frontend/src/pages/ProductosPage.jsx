// src/pages/ProductosPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Productcard';
import ProductFilters from '../components/ProductFilters';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [ecoFriendlyOnly, setEcoFriendlyOnly] = useState(false);

  // Leer parámetros de URL al cargar (para categoría desde CategoryPage)
  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategories([categoryId]);
    }
  }, [searchParams]);

  // Debounce para el buscador - evita lag al escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // Espera 300ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`);
        const data = res.data && res.data.data ? res.data.data : res.data;
        const meta = res.data && res.data.meta ? res.data.meta : { totalPages: 1, total: data.length };
        if (mounted) {
          setProductos(data);
          setTotalPages(meta.totalPages || 1);
          setTotalProducts(meta.total || data.length);
          
          // // Debug: Ver qué materiales hay en los productos
          // console.log('📦 Productos cargados:', data.length);
          // const materialesEncontrados = [...new Set(data.map(p => p.material).filter(Boolean))];
          // console.log('🧵 Materiales en DB:', materialesEncontrados);
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
  }, [currentPage]);

  // Filtrado y ordenamiento frontend
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productos.filter(product => {
      // Search filter - busca en nombre y descripción (usando debounced search)
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesDescription = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDescription) return false;
      }
      
      // Price filter - Asegurar que el producto tenga precio válido
      const productPrice = product.price || 0;
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false;
      }
      
      // Category filter
      if (selectedCategories.length > 0) {
        const productCategoryId = typeof product.category === 'object' 
          ? product.category._id 
          : product.category;
        const productCategoryName = typeof product.category === 'object'
          ? product.category.name
          : null;
        
        const matchesCategory = selectedCategories.some(cat => 
          cat === productCategoryId || cat === productCategoryName
        );
        
        if (!matchesCategory) return false;
      }
      
      // Material filter - Comparación más flexible
      if (selectedMaterials.length > 0) {
        // Si el producto no tiene material, no lo mostramos
        if (!product.material) return false;
        
        const productMaterial = product.material.toLowerCase().trim();
        const matchesMaterial = selectedMaterials.some(mat => {
          const filterMaterial = mat.toLowerCase().trim();
          // Busca coincidencias parciales en ambas direcciones
          return productMaterial.includes(filterMaterial) || filterMaterial.includes(productMaterial);
        });
        
        if (!matchesMaterial) return false;
      }
      
      // Size filter
      if (selectedSizes.length > 0) {
        if (!product.sizes || product.sizes.length === 0) return false;
        const matchesSize = selectedSizes.some(size => 
          product.sizes.includes(size)
        );
        if (!matchesSize) return false;
      }

      // Eco-friendly filter
      if (ecoFriendlyOnly && !product.ecoFriendly) {
        return false;
      }
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return filtered;
  }, [productos, debouncedSearch, priceRange, selectedCategories, selectedMaterials, selectedSizes, ecoFriendlyOnly, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setEcoFriendlyOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            ecoFriendlyOnly={ecoFriendlyOnly}
            onEcoFriendlyChange={setEcoFriendlyOnly}
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
              {(selectedCategories.length > 0 || selectedMaterials.length > 0 || selectedSizes.length > 0 || debouncedSearch || ecoFriendlyOnly) && (
                <div className="products-filters-badges">
                  {debouncedSearch && (
                    <button className="product-filter-badge">
                      Búsqueda: "{debouncedSearch}"
                    </button>
                  )}
                  {ecoFriendlyOnly && (
                    <button className="product-filter-badge">
                      Solo Eco-Friendly
                    </button>
                  )}
                  {selectedCategories.length > 0 && (
                    <button className="product-filter-badge">
                      {selectedCategories.length} categoría(s)
                    </button>
                  )}
                  {selectedMaterials.length > 0 && (
                    <button className="product-filter-badge">
                      Materiales: {selectedMaterials.join(', ')}
                    </button>
                  )}
                  {selectedSizes.length > 0 && (
                    <button className="product-filter-badge">
                      Tallas: {selectedSizes.join(', ')}
                    </button>
                  )}
                  {priceRange[0] > 0 || priceRange[1] < 200 ? (
                    <button className="product-filter-badge">
                      Precio: ${priceRange[0]} - ${priceRange[1]}
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.images && product.images.length ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'}
                  rating={product.rating || 0}
                  reviews={product.reviews || 0}
                  isOrganic={product.ecoFriendly || false}
                  isNew={product.createdAt && (new Date() - new Date(product.createdAt)) < 30*24*60*60*1000}
                  onProductClick={() => navigate(`/producto/${product._id}`)}
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

export default ProductosPage;