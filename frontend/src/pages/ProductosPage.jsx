// src/pages/ProductosPage.jsx
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../style/products.css';

// Expanded product data (en el formato que espera ProductCard)
const allProducts = [
  {
    _id: '1',
    nombre: 'Camiseta de Algodón Orgánico Premium',
    precio: 45,
    imagen: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.8,
    nuevo: true,
    organico: true,
  },
  {
    _id: '2',
    nombre: 'Camisa de Lino Natural Respirable',
    precio: 78,
    imagen: ' https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbGluZW4lMjBzaGlydCUyMG5hdHVyYWwlMjBmYWJyaWN8ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.6,
    organico: true,
  },
  {
    _id: '3',
    nombre: 'Vestido de Bambú Sostenible',
    precio: 92,
    imagen: ' https://images.unsplash.com/photo-1643185720431-9c050eebbc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhbWJvbyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzU1MDMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.9,
    nuevo: true,
    organico: true,
  },
  {
    _id: '4',
    nombre: 'Pantalón de Cáñamo Ecológico',
    precio: 86,
    imagen: ' https://images.unsplash.com/photo-1543121032-68865adeff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGhlbXAlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTc1NTAzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.7,
    nuevo: true,
    organico: true,
  },
  {
    _id: '5',
    nombre: 'Sudadera de Algodón Orgánico',
    precio: 68,
    imagen: ' https://images.unsplash.com/photo-1636378191768-a553ab8d8614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwaG9vZGllJTIwc3VzdGFpbmFibGUlMjBmYXNoaW9ufGVufDF8fHx8MTc1ODUwMDg3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.5,
    nuevo: true,
    organico: true,
  },
  {
    _id: '6',
    nombre: 'Chaqueta Eco-Friendly',
    precio: 125,
    imagen: ' https://images.unsplash.com/photo-1718128306989-a5bd41566cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGphY2tldCUyMHN1c3RhaW5hYmxlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU4NTAwODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.8,
    organico: true,
  },
  {
    _id: '7',
    nombre: 'Suéter de Lana Orgánica',
    precio: 95,
    imagen: ' https://images.unsplash.com/photo-1633972767447-5098f0322a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwd29vbCUyMHN3ZWF0ZXIlMjBuYXR1cmFsJTIwZmFicmljfGVufDF8fHx8MTc1ODUwMDg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.7,
    organico: true,
  },
  {
    _id: '8',
    nombre: 'Jeans Sostenibles',
    precio: 89,
    imagen: ' https://images.unsplash.com/photo-1737093805570-5d314ff60b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRlbmltJTIwamVhbnMlMjBvcmdhbmljJTIwY290dG9ufGVufDF8fHx8MTc1ODUwMDg4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    estrellas: 4.4,
    nuevo: true,
    organico: true,
  }
];

const PRODUCTS_PER_PAGE = 8;

const ProductosPage = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      if (searchQuery && !product.nombre.toLowerCase().includes(searchQuery.toLowerCase())) {
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
  }, [searchQuery, selectedCategories, priceRange, selectedMaterials, selectedSizes, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

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

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
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
                Mostrando {currentProducts.length} de {filteredAndSortedProducts.length} productos
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
          {currentProducts.length > 0 ? (
            <div className="products-grid">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} producto={product} onProductClick={handleProductClick} />
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