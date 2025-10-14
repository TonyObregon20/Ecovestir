// src/components/FormularioProducto.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

export default function FormularioProducto({ producto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "", // 👈 Vacío, se llenará con _id
    ecoFriendly: false,
    stock: "",
    isActive: true,
    images: [""],
  });

  const [categorias, setCategorias] = useState([]);

  // 👇 Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/api/categories');
        // 👇 Accede a res.data.data porque tu backend devuelve { data: [...], meta: {...} }
        setCategorias(res.data.data || []);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        alert('No se pudieron cargar las categorías. Verifica la conexión.');
      }
    };
    fetchCategorias();
  }, []);

  // 👇 Llenar el formulario cuando hay un producto
  useEffect(() => {
    if (producto) {
      setFormData({
        name: producto.name || "",
        price: producto.price || "",
        // 👇 Si category es un objeto (con _id), usa _id; si es string, déjalo (para compatibilidad)
        category: producto.category?._id || producto.category || "",
        ecoFriendly: producto.ecoFriendly || false,
        stock: producto.stock || "",
        isActive: producto.isActive !== undefined ? producto.isActive : true,
        images: producto.images && producto.images.length ? [...producto.images] : [""],
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert("Por favor completa los campos obligatorios: Nombre, Precio y Categoría.");
      return;
    }

    const productoParaEnviar = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock ? Number(formData.stock) : 0,
      images: formData.images.filter(img => img.trim() !== ""),
    };

    onSubmit(productoParaEnviar);
  };

  return (
    <div className="formulario-producto">
      <h2>{producto ? "Editar Producto" : "Agregar Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Precio ($)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label>Categoría *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}> {/* 👈 value = _id */}
                {cat.name} {/* 👈 texto = nombre */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="ecoFriendly"
              checked={formData.ecoFriendly}
              onChange={handleChange}
            />
            Producto Ecológico
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>

        <div>
          <label>Imágenes (URLs)</label>
          {formData.images.map((url, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{ flex: 1 }}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  style={{ background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            style={{ background: "#059669", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginTop: "8px" }}
          >
            + Añadir Imagen
          </button>
        </div>

        <div className="formulario-botones">
          <button type="submit">
            {producto ? "Actualizar" : "Crear Producto"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}