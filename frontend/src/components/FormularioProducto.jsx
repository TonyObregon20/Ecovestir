// src/components/FormularioProducto.jsx
import { useState, useEffect } from "react";

export default function FormularioProducto({ producto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "otros", // 👈 Valor por defecto válido
    ecoFriendly: false,
    stock: "",
    isActive: true,
    images: [""],
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        name: producto.name || "",
        price: producto.price || "",
        category: producto.category || "otros",
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
    
    if (!formData.name || !formData.price) {
      alert("Por favor completa los campos obligatorios: Nombre y Precio.");
      return;
    }

    // Validar que la categoría sea válida (aunque el select ya lo garantiza)
    const categoriasValidas = ["camisetas", "pantalones", "accesorios", "otros"];
    if (!categoriasValidas.includes(formData.category)) {
      alert("Categoría inválida. Selecciona una opción válida.");
      return;
    }

    const productoParaEnviar = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock ? Number(formData.stock) : 0, // 👈 Manejar stock vacío
      images: formData.images.filter(img => img.trim() !== ""),
    };

    onSubmit(productoParaEnviar);
  };

  // Opciones de categoría
  const categorias = [
    { value: "camisetas", label: "Camisetas" },
    { value: "pantalones", label: "Pantalones" },
    { value: "accesorios", label: "Accesorios" },
    { value: "otros", label: "Otros" }
  ];

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
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
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