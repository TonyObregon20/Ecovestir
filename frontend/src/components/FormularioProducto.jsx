// src/components/FormularioProducto.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from 'lucide-react';
import api from "../api/api";

export default function FormularioProducto({ producto, onSubmit, onCancel }) {
  // ESTADO: Datos del formulario con stock por cada talla
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    material: "",
    ecoFriendly: false,
    // sizeStock: Array con el stock de cada talla (S, M, L, XL)
    sizeStock: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 }
    ],
    rating: 0,
    reviews: 0,
    isActive: true,
    images: [""],
  });
  const [categoriesList, setCategoriesList] = useState([]);

  const [categorias, setCategorias] = useState([]);

  // EFECTO: Cargar categorías desde el backend al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/api/categories');
        // Accede a res.data.data porque el backend devuelve { data: [...], meta: {...} }
        setCategorias(res.data.data || []);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        alert('No se pudieron cargar las categorías. Verifica la conexión.');
      }
    };
    fetchCategorias();
  }, []);

  // EFECTO: Llenar el formulario cuando se edita un producto existente
  useEffect(() => {
    if (producto) {
      // INICIALIZACIÓN: Tallas por defecto con stock 0
      let initialSizeStock = [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 }
      ];

      // Si el producto tiene sizeStock, mapear los valores
      if (producto.sizeStock && producto.sizeStock.length > 0) {
        initialSizeStock = initialSizeStock.map(defaultSize => {
          const found = producto.sizeStock.find(s => s.size === defaultSize.size);
          return found ? { ...found } : defaultSize;
        });
      }

      // POBLACIÓN: Llenar todos los campos del formulario
      setFormData({
        name: producto.name || "",
        description: producto.description || "",
        price: producto.price || "",
        category: producto.category?._id || producto.category || "",
        material: producto.material || "",
        ecoFriendly: producto.ecoFriendly || false,
        sizeStock: initialSizeStock,
        rating: producto.rating || 0,
        reviews: producto.reviews || 0,
        isActive: producto.isActive !== undefined ? producto.isActive : true,
        images: producto.images && producto.images.length ? [...producto.images] : [""],
      });
    }
  }, [producto]);

  // EFECTO: Establecer categoría por defecto cuando se carga la lista
  useEffect(() => {
    if (!producto && categoriesList.length) {
      setFormData(fd => ({ ...fd, category: categoriesList[0]._id }));
    }
  }, [categoriesList, producto]);

  // MANEJADOR: Actualizar campos del formulario (texto, checkbox, etc.)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // MANEJADOR: Actualizar el stock de una talla específica
  // Se ejecuta cuando el usuario cambia el valor en un input de talla
  const handleSizeStockChange = (size, value) => {
    const newSizeStock = formData.sizeStock.map(item =>
      item.size === size ? { ...item, stock: parseInt(value) || 0 } : item
    );
    setFormData({ ...formData, sizeStock: newSizeStock });
  };

  // CÁLCULO: Obtener el stock total sumando todas las tallas
  // Se usa para validación y mostrar el total en la UI
  const getTotalStock = () => {
    return formData.sizeStock.reduce((sum, item) => sum + item.stock, 0);
  };

  // MANEJADOR: Actualizar una URL de imagen en un índice específico
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  // MANEJADOR: Agregar un nuevo campo de imagen
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  // MANEJADOR: Eliminar un campo de imagen (mínimo 1)
  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  // MANEJADOR: Validar y enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDACIÓN: Campos obligatorios
    if (!formData.name || !formData.price || !formData.category) {
      alert("Por favor completa los campos obligatorios: Nombre, Precio y Categoría.");
      return;
    }

    // VALIDACIÓN: Al menos una talla debe tener stock
    const totalStock = getTotalStock();
    if (totalStock === 0) {
      alert("Debes asignar stock a al menos una talla.");
      return;
    }

    // PREPARACIÓN: Construir objeto para enviar al backend
    const productoParaEnviar = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating) || 0,
      reviews: Number(formData.reviews) || 0,
      sizeStock: formData.sizeStock.filter(item => item.stock > 0), // Solo tallas con stock
      images: formData.images.filter(img => img.trim() !== ""),     // Solo URLs válidas
    };

    onSubmit(productoParaEnviar);
  };

  return (
    <div className="formulario-producto-overlay">
      <div className="formulario-producto-modal">
        <div className="formulario-header">
          <button type="button" className="back-btn" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div>
            <h2>{producto ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
            <p className="text-gray-600 mt-1">{producto ? 'Modifica la información del producto' : 'Completa la información para crear un nuevo producto'}</p>
          </div>
          <button type="button" className="close-btn" onClick={onCancel}><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="formulario-form">
          {/* Main column */}
          <div>
            {/* Información Básica */}
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>
              <div className="form-group">
                <label htmlFor="name">Nombre del Producto *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. camiseta blanca"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe las características del producto"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Categoría *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una</option>
                    {categorias.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="material">Material *</label>
                  <input
                    id="material"
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio ($)*</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Stock por Talla */}
            <div className="form-section">
              <h3 className="section-title">Inventario</h3>
              <div className="size-stock-section">
                <label>Stock por Talla *</label>
                <div className="size-stock-grid">
                  {formData.sizeStock.map((item) => (
                    <div key={item.size} className="size-stock-item">
                      <label className="size-label">{item.size}</label>
                      <input
                        type="number"
                        value={item.stock}
                        onChange={(e) => handleSizeStockChange(item.size, e.target.value)}
                        min="0"
                        className="size-stock-input"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                <div className="total-stock">
                  <strong>Stock Total:</strong> {getTotalStock()} unidades
                </div>
              </div>
            </div>

            {/* After Inventario: Imagen y Propiedades (moved from sidebar) */}
            {/* Image */}
            <div className="form-section">
              <h3 className="section-title">Imagen del Producto *</h3>
              {formData.images && formData.images[0] ? (
                <div className="relative">
                  <img src={formData.images[0]} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                  <button type="button" className="sidebar-action-btn" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleImageChange(0, '')}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No hay imagen seleccionada</p>
                </div>
              )}

              <div className="form-group" style={{ marginTop: 12 }}>
                <label htmlFor="imageUrl">URL de la Imagen *</label>
                <input
                  id="imageUrl"
                  value={formData.images[0] || ''}
                  onChange={(e) => handleImageChange(0, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <div style={{ marginTop: 8 }}>
                  <button type="button" className="sidebar-action-btn" onClick={() => { const url = prompt('Ingresa la URL de la imagen:'); if (url) handleImageChange(0, url); }}>
                    <Upload className="w-4 h-4" /> Agregar Imagen
                  </button>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="form-section">
              <h3 className="section-title">Propiedades</h3>
              <div className="form-group">
                <label htmlFor="rating">Calificación (0-5)</label>
                <input
                  id="rating"
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reviews">Número de Reseñas</label>
                <input
                  id="reviews"
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="ecoFriendly" checked={formData.ecoFriendly} onChange={handleChange} />
                  <span>Producto Ecológico</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                  <span>Producto Activo</span>
                </label>
              </div>
            </div>

            {/* Actions: buttons at the very bottom (no container) */}
            <div className="formulario-botones" style={{ flexDirection: 'column', borderTop: 'none', paddingTop: 12, marginTop: 12 }}>
              <button type="submit" className="btn-submit" style={{ width: '100%' }}>{producto ? 'Actualizar Producto' : 'Crear Producto'}</button>
              <button type="button" className="btn-cancel" style={{ width: '100%' }} onClick={onCancel}>Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}