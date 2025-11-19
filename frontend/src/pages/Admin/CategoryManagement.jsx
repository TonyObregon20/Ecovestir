import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Tag,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import './categoryManagement.css';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';

// We'll fetch categories from the API (no static data)

export function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', isActive: true });
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      // Normalize fields: backend may return _id and productsCount
      const normalized = (data || []).map(c => ({
        id: c._id || c.id,
        name: c.name,
        slug: c.slug || (c.name || '').toLowerCase().replace(/\s+/g, '-'),
        description: c.description || '',
        image: c.image || '',
        productCount: c.productsCount ?? c.productCount ?? 0,
        isActive: typeof c.isActive !== 'undefined' ? c.isActive : (c.active ?? true),
        raw: c
      }));
      setCategories(normalized);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      window.alert('Error cargando categorías. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // debounce the searchTerm to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    cat.description.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const openCreate = () => {
    setFormData({ name: '', description: '', image: '', isActive: true });
    setIsCreateOpen(true);
  };

  const handleCreate = () => {
    (async () => {
      try {
        if (!formData.name || !formData.description) {
          window.alert('Nombre y descripción son requeridos');
          return;
        }
        const payload = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive
        };
        await createCategory(payload);
        setIsCreateOpen(false);
        resetForm();
        await fetchCategories();
        window.alert('Categoría creada exitosamente');
      } catch (err) {
        console.error('Error creando categoría:', err);
        const msg = err?.data?.message || err.message || 'Error creando categoría';
        window.alert(msg);
      }
    })();
  };

  const openEdit = (cat) => {
    setSelectedCategory(cat);
    setFormData({ name: cat.name, description: cat.description, image: cat.image, isActive: cat.isActive });
    setIsEditOpen(true);
  };

  const handleEdit = () => {
    (async () => {
      try {
        if (!selectedCategory) return;
        if (!formData.name || !formData.description) {
          window.alert('Nombre y descripción son requeridos');
          return;
        }
        const payload = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive
        };
        await updateCategory(selectedCategory.id || selectedCategory._id, payload);
        setIsEditOpen(false);
        setSelectedCategory(null);
        resetForm();
        await fetchCategories();
        window.alert('Categoría actualizada exitosamente');
      } catch (err) {
        console.error('Error actualizando categoría:', err);
        const msg = err?.data?.message || err.message || 'Error actualizando categoría';
        window.alert(msg);
      }
    })();
  };

  const handleDelete = (id) => {
    (async () => {
      try {
        const cat = categories.find(c => c.id === id);
        if (cat && cat.productCount > 0) {
          window.alert('No se puede eliminar una categoría con productos asociados');
          return;
        }
        if (!window.confirm('¿Eliminar esta categoría?')) return;
        await deleteCategory(id);
        await fetchCategories();
        window.alert('Categoría eliminada exitosamente');
      } catch (err) {
        console.error('Error eliminando categoría:', err);
        const msg = err?.data?.message || err.message || 'Error eliminando categoría';
        window.alert(msg);
      }
    })();
  };

  const toggleActive = (id) => {
    (async () => {
      try {
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        await updateCategory(id, { isActive: !cat.isActive });
        await fetchCategories();
        window.alert('Estado de categoría actualizado');
      } catch (err) {
        console.error('Error actualizando estado:', err);
        window.alert('Error actualizando estado');
      }
    })();
  };

  const resetForm = () => setFormData({ name: '', description: '', image: '', isActive: true });

  return (
    <div className="cm-container">
      <div className="cm-header">
        <div>
          <h1 className="cm-title">Gestión de Categorías</h1>
          <p className="cm-sub">Administra las categorías de productos de la tienda</p>
        </div>

        <div>
          <button className="cm-btn cm-btn-primary" onClick={openCreate}>
            <Plus className="cm-icon" /> Nueva Categoría
          </button>
        </div>
      </div>

      <div className="cm-stats">
        <div className="cm-card">
          <div className="cm-card-head">
            <div className="cm-card-title">Total Categorías</div>
            <Tag className="cm-card-icon" />
          </div>
          <div className="cm-card-value">{categories.length}</div>
          <div className="cm-card-sub">En el sistema</div>
        </div>

        <div className="cm-card">
          <div className="cm-card-head">
            <div className="cm-card-title">Categorías Activas</div>
            <Tag className="cm-card-icon green" />
          </div>
          <div className="cm-card-value">{categories.filter(c => c.isActive).length}</div>
          <div className="cm-card-sub">Visibles en la tienda</div>
        </div>

        <div className="cm-card">
          <div className="cm-card-head">
            <div className="cm-card-title">Total Productos</div>
            <Package className="cm-card-icon" />
          </div>
          <div className="cm-card-value">{categories.reduce((s, c) => s + c.productCount, 0)}</div>
          <div className="cm-card-sub">En todas las categorías</div>
        </div>
      </div>

      <div className="search-bar" style={{ marginBottom: 18 }}>
        <input
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cm-grid">
        {filteredCategories.map(category => (
          <div className="cm-card cm-cat" key={category.id}>
            <div className="cm-img-wrap">
              <img src={category.image} alt={category.name} className="cm-img" />
              {!category.isActive && (
                <div className="cm-overlay">
                  <div className="cm-badge cm-badge-secondary">Inactiva</div>
                </div>
              )}
            </div>

            <div className="cm-content">
              <div className="cm-row">
                <div>
                  <h3 className="cm-name">{category.name}</h3>
                  <div className="cm-slug">/{category.slug}</div>
                </div>

                <div className="cm-actions">
                  <button className="cm-icon-btn" onClick={() => openEdit(category)} title="Editar">
                    <Edit className="cm-icon" />
                  </button>
                  <div className="cm-dropdown">
                    <button className="cm-icon-btn">
                      <MoreVertical className="cm-icon" />
                    </button>
                    <div className="cm-dropdown-content">
                      <button className="cm-dd-item" onClick={() => openEdit(category)}>
                        <Edit className="cm-icon" /> Editar
                      </button>
                      <button className="cm-dd-item" onClick={() => toggleActive(category.id)}>
                        <ImageIcon className="cm-icon" /> {category.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      <button className="cm-dd-item cm-danger" onClick={() => handleDelete(category.id)} disabled={category.productCount > 0}>
                        <Trash2 className="cm-icon" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="cm-desc">{category.description}</p>

              <div className="cm-footer">
                <div className="cm-meta">
                  <Package className="cm-icon" /> <span>{category.productCount} productos</span>
                </div>
                <div>
                  <div className={`cm-badge ${category.isActive ? 'cm-badge-active' : 'cm-badge-inactive'}`}>
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="cm-empty">
          <Tag className="cm-empty-icon" />
          <p>No se encontraron categorías</p>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="formulario-producto-overlay">
          <div className="formulario-producto-modal">
            <div className="formulario-header">
              <h2>Crear Nueva Categoría</h2>
              <button className="close-btn" onClick={() => { setIsCreateOpen(false); resetForm(); }}>✕</button>
            </div>
            <form className="formulario-form" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
              <div className="form-group">
                <label>Nombre</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="form-group">
                <label>URL de imagen (opcional)</label>
                <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>

              <label className="checkbox-label" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                <span>Categoría activa</span>
              </label>

              <div className="formulario-botones">
                <button type="button" className="btn-cancel" onClick={() => { setIsCreateOpen(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn-submit">Crear Categoría</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="formulario-producto-overlay">
          <div className="formulario-producto-modal">
            <div className="formulario-header">
              <h2>Editar Categoría</h2>
              <button className="close-btn" onClick={() => { setIsEditOpen(false); setSelectedCategory(null); resetForm(); }}>✕</button>
            </div>
            <form className="formulario-form" onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="form-group">
                <label>Nombre</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="form-group">
                <label>URL de imagen (opcional)</label>
                <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>

              <label className="checkbox-label" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                <span>Categoría activa</span>
              </label>

              <div className="formulario-botones">
                <button type="button" className="btn-cancel" onClick={() => { setIsEditOpen(false); setSelectedCategory(null); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn-submit">Actualizar Categoría</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;
