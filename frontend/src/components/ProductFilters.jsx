// src/components/ProductFilters.jsx

import React, { useState, useEffect } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../api/api';
import { getCategories } from '../api/categories';
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

  // Calculate the percentage for the green range indicator
  const leftPercent = ((value[0] - min) / (max - min)) * 100;
  const rightPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="product-filters-price-slider-container">
      <div className="product-filters-slider-track-bg"></div>
      <div 
        className="product-filters-slider-track-fill"
        style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
      ></div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        data-index="0"
        onChange={handleChange}
        className="product-filters-slider-input"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        data-index="1"
        onChange={handleChange}
        className="product-filters-slider-input"
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
  ecoFriendlyOnly,
  onEcoFriendlyChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  // const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Cargar categorías del backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Cargar materiales dinámicamente a partir de los productos
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoadingMaterials(true);
        // traemos más productos para asegurar variedad; backend tiene paginación por defecto
        const res = await api.get('/api/products?limit=1000');
        const data = res.data && res.data.data ? res.data.data : res.data;
        // Extraer materiales únicos (normalizados)
        const materialsSet = new Map();
        (data || []).forEach((p) => {
          if (!p) return;
          const raw = p.material || p.materials || p.materialo || '';
          if (!raw) return;
          const key = String(raw).toLowerCase().trim();
          if (!materialsSet.has(key)) {
            materialsSet.set(key, String(raw).trim());
          }
        });
        const list = Array.from(materialsSet.values());
        setMaterials(list);
      } catch (err) {
        console.error('Error loading materials:', err);
        setMaterials([]);
      } finally {
        setLoadingMaterials(false);
      }
    };
    fetchMaterials();
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorados' },
    { value: 'name', label: 'Nombre A-Z' }
  ];



  // Tallas según el modelo Product (enum en el backend: S, M, L, XL)
  const sizes = React.useMemo(() => ['S', 'M', 'L', 'XL'], []);

  const handleCategoryToggle = React.useCallback((categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(c => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  }, [selectedCategories, onCategoryChange]);

  const handleMaterialToggle = React.useCallback((material) => {
    if (selectedMaterials.includes(material)) {
      onMaterialChange(selectedMaterials.filter(m => m !== material));
    } else {
      onMaterialChange([...selectedMaterials, material]);
    }
  }, [selectedMaterials, onMaterialChange]);

  const handleSizeToggle = React.useCallback((size) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  }, [selectedSizes, onSizeChange]);

  const FilterContent = React.useMemo(() => (
    <div className="product-filters-content">
      {/* Búsqueda - Estilo como en el navbar */}
      <div className="product-filters-group">
        <label className="product-filters-group-title">Buscar Productos</label>
        <div className="product-filters-search-navbar-style">
          {/* <Search className="product-filters-search-icon" size={16} /> */}
          <input
            type="text"
            placeholder="Buscar por nombre"
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
          {loadingCategories ? (
            <p style={{ fontSize: '14px', color: '#666' }}>Cargando...</p>
          ) : categories.length > 0 ? ( 
            categories.map((category) => (
              <Checkbox
                key={category._id}
                id={`category-${category._id}`}
                checked={selectedCategories.includes(category._id) || selectedCategories.includes(category.name)}
                onChange={() => handleCategoryToggle(category._id)}
              >
                {category.name}
              </Checkbox>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#666' }}>No hay categorías disponibles</p>
          )}
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
      
      {/* Modifique para que llame a los materiales que se tiene en los productos */}
      {/* Materiales */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Materiales</h4>
        <div className="product-filters-material">
          {loadingMaterials ? (
            <p style={{ fontSize: '14px', color: '#666' }}>Cargando materiales...</p>
          ) : materials.length > 0 ? (
            materials.map((material) => (
              <Checkbox
                key={material}
                id={`material-${material.replace(/\s+/g, '-').toLowerCase()}`}
                checked={selectedMaterials.includes(material)}
                onChange={() => handleMaterialToggle(material)}
              >
                {material}
              </Checkbox>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#666' }}>No hay materiales disponibles</p>
          )}
        </div>
      </div>

      {/* Tallas */}
      <div className="product-filters-group">
        <h4 className="product-filters-group-title">Tallas</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`product-filters-size-btn ${selectedSizes.includes(size) ? 'selected' : ''}`}
              style={{
                backgroundColor: selectedSizes.includes(size) ? '#059669' : 'white',
                color: selectedSizes.includes(size) ? 'white' : '#6b7280',
                border: selectedSizes.includes(size) ? '1px solid #059669' : '1px solid #d1d5db',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro Eco-Friendly */}
      <div className="product-filters-group">
        <Checkbox
          id="eco-friendly"
          checked={ecoFriendlyOnly}
          onChange={(e) => onEcoFriendlyChange(e.target.checked)}
        >
          <span style={{ fontWeight: '500', color: '#2d6a4f' }}>
            Solo productos eco-friendly
          </span>
        </Checkbox>
      </div>

      {/* Limpiar Filtros */}
      <button
        className="product-filters-clear"
        onClick={onClearFilters}
      >
        Limpiar Filtros
      </button>
    </div>
  ), [
    searchQuery, onSearchChange, loadingCategories, categories, selectedCategories,
    handleCategoryToggle, priceRange, onPriceRangeChange, loadingMaterials, 
    materials, selectedMaterials, handleMaterialToggle, sizes, selectedSizes,
    handleSizeToggle, ecoFriendlyOnly, onEcoFriendlyChange, onClearFilters
  ]);

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
        {/* <button
          className="product-filters-mobile-btn lg:hidden"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filtros
        </button> */}
      </div>

      {/* Filtros de escritorio */}
      <div className="product-filters-sidebar desktop">
        <h3 className="product-filters-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000 !important' }}>
          <Filter size={18} style={{ color: '#000' }} />
          <span style={{ color: '#000' }}>Filtros</span>
        </h3>
        {FilterContent}
      </div>

      {/* Filtros móviles */}
      {/* {isMobileFiltersOpen && (
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
              {FilterContent}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default ProductFilters;