// src/components/ProductFilters.jsx

import React, { useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import '../style/productFilters.css';

const Checkbox = ({ id, checked, onChange, children }) => (
  <div className="product-filters-checkbox-item">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="product-filters-checkbox-input"
    />
    <label htmlFor={id} className="product-filters-checkbox-label">
      {children}
    </label>
  </div>
);

const Slider = ({ value, onValueChange, min, max, step }) => {
  const handleChange = (e) => {
    const newValue = [...value];
    const index = parseInt(e.target.dataset.index);
    newValue[index] = Number(e.target.value);
    if (index === 0 && newValue[0] > newValue[1]) newValue[1] = newValue[0];
    if (index === 1 && newValue[1] < newValue[0]) newValue[0] = newValue[1];
    onValueChange(newValue);
  };

  return (
    <div className="product-filters-price-slider-container">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        data-index="0"
        onChange={handleChange}
        className="product-filters-slider-track"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        data-index="1"
        onChange={handleChange}
        className="product-filters-slider-track"
      />
      <div className="product-filters-price-values">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  );
};

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="product-filters-sort-select"
  >
    {children}
  </select>
);

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const ProductFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedMaterials,
  onMaterialChange,
  selectedSizes,
  onSizeChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorados' },
    { value: 'name', label: 'Nombre A-Z' }
  ];

  const categories = [
    'Camisetas',
    'Vestidos',
    'Pantalones',
    'Camisas',
    'Sudaderas',
    'Chaquetas',
    'Suéteres',
    'Shorts',
    'Blusas',
    'Jeans'
  ];

  const materials = [
    'Algodón Orgánico',
    'Lino Natural',
    'Bambú',
    'Cáñamo',
    'Lana Orgánica',
    'Modal',
    'Tencel'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleMaterialToggle = (material) => {
    if (selectedMaterials.includes(material)) {
      onMaterialChange(selectedMaterials.filter(m => m !== material));
    } else {
      onMaterialChange([...selectedMaterials, material]);
    }
  };

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  const FilterContent = () => (
    <div className="product-filters-content">
      {/* Búsqueda - Estilo como en el navbar */}
      <div className="product-filters-group">
        <label className="product-filters-group-title">Buscar Productos</label>
        <div className="product-filters-search-navbar-style">
          <Search className="product-filters-search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="product-filters-search-input-navbar"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Categorías</h4>
        <div className="product-filters-category">
          {categories.map((category) => (
            <Checkbox
              key={category}
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
            >
              {category}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Rango de Precios */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Rango de Precio</h4>
        <div className="product-filters-price-range">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            min={0}
            max={200}
            step={5}
          />
        </div>
      </div>

      {/* Materiales */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Materiales</h4>
        <div className="product-filters-material">
          {materials.map((material) => (
            <Checkbox
              key={material}
              id={`material-${material}`}
              checked={selectedMaterials.includes(material)}
              onChange={() => handleMaterialToggle(material)}
            >
              {material}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Tallas */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Tallas</h4>
        <div className="product-filters-sizes">
          <div className="product-filters-sizes-grid">
            {sizes.map((size) => (
              <button
                key={size}
                className={`product-filters-size-btn ${selectedSizes.includes(size) ? 'selected' : ''}`}
                onClick={() => handleSizeToggle(size)}
                style={{ marginRight: '8px', marginBottom: '8px' }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Limpiar Filtros */}
      <button
        className="product-filters-clear"
        onClick={onClearFilters}
      >
        Limpiar Filtros
      </button>
    </div>
  );

  return (
    <>
      {/* Controles de ordenamiento (solo en desktop) */}
      <div className="product-filters-header">
        <div className="product-filters-sort">
          <span className="product-filters-sort-label">Ordenar por:</span>
          <Select value={sortBy} onChange={onSortChange}>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Botón de filtros para móvil */}
        <button
          className="product-filters-mobile-btn lg:hidden"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filtros
        </button>
      </div>

      {/* Filtros de escritorio */}
      <div className="product-filters-sidebar desktop">
        <h3 className="product-filters-title">
          <Filter size={18} />
          Filtros
        </h3>
        <FilterContent />
      </div>

      {/* Filtros móviles */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;