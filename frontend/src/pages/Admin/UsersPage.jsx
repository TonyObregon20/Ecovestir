// src/pages/Admin/UsersPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const roleRef = useRef(null);
  const statusRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal de nuevo usuario
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  // Modal de edición
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const response = await fetch(`${baseURL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      // Normalizar campo status por si falta en algunos documentos
      const normalized = (data || []).map(u => ({
        ...u,
        status: typeof u.status !== 'undefined' && u.status !== null ? u.status : 'active'
      }));
      setUsers(normalized);
    } catch (err) {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch = (user.name || '').toLowerCase().includes(q) ||
                          (user.email || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' ||
                        (roleFilter === 'admin' && user.role === 'admin') ||
                        (roleFilter === 'customer' && user.role === 'customer');
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'active' && user.status === 'active') ||
                          (statusFilter === 'inactive' && user.status === 'inactive');
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) setShowRoleDropdown(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Manejar cambios en el formulario de creación
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    setModalSuccess(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setModalLoading(false);
      return;
    }

    try {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const response = await fetch(`${baseURL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el usuario');
      }

      setModalSuccess(true);
      setNewUser({ name: '', email: '', password: '', role: 'customer' });
      await fetchUsers();

      setTimeout(() => {
        setShowModal(false);
        setModalSuccess(false);
      }, 1500);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Abrir modal de edición
  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Guardar cambios del usuario editado
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setModalLoading(false);
      return;
    }

    try {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const response = await fetch(`${baseURL}/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          password: editingUser.password || undefined, // Solo si se cambia
          role: editingUser.role,
          status: editingUser.status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el usuario');
      }

      setModalSuccess(true);
      setShowEditModal(false);
      setEditingUser(null);
      await fetchUsers();

      setTimeout(() => setModalSuccess(false), 1500);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }

    try {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const response = await fetch(`${baseURL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar el usuario');
      }

      alert('Usuario eliminado exitosamente');
      await fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="login-error" style={{ margin: '20px 0' }}>
          {error}
        </div>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema y sus roles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="add-product-btn"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Tarjetas */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Usuarios</h3>
          <span>{totalUsers}</span>
          <small>{activeUsers} activos</small>
        </div>
        <div className="summary-card">
          <h3>Administradores</h3>
          <span>{adminCount}</span>
          <small>Con acceso completo</small>
        </div>
        <div className="summary-card">
          <h3>Clientes</h3>
          <span>{customerCount}</span>
          <small>Acceso limitado</small>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Search icon (inline SVG) */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#9ca3af' }}>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div ref={roleRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowRoleDropdown(s => !s)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'var(--blanco)',
                  color: 'var(--gris-oscuro)',
                  border: '1px solid var(--gris-claro)',
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  minWidth: 180,
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#6b7280' }}>
                    <path d="M10 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {roleFilter === 'all' ? 'Todos los roles' : roleFilter === 'admin' ? 'Administradores' : 'Clientes'}
                </span>
                <span style={{ color: '#9ca3af' }}>▾</span>
              </button>

              {showRoleDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 1100, minWidth: 220, background: '#fff', border: '1px solid #e6e9ef', borderRadius: 8, boxShadow: '0 8px 20px rgba(2,6,23,.08)', overflow: 'hidden' }}>
                  <button onClick={() => { setRoleFilter('all'); setShowRoleDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Todos los roles</span>
                    {roleFilter === 'all' && <span>✓</span>}
                  </button>
                  <button onClick={() => { setRoleFilter('admin'); setShowRoleDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Administradores</span>
                    {roleFilter === 'admin' && <span>✓</span>}
                  </button>
                  <button onClick={() => { setRoleFilter('customer'); setShowRoleDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Clientes</span>
                    {roleFilter === 'customer' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>

            <div ref={statusRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowStatusDropdown(s => !s)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'var(--blanco)',
                  color: 'var(--gris-oscuro)',
                  border: '1px solid var(--gris-claro)',
                  padding: '10px 14px',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  minWidth: 180,
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#6b7280' }}>
                    <path d="M10 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {statusFilter === 'all' ? 'Todos los estados' : statusFilter === 'active' ? 'Activos' : 'Inactivos'}
                </span>
                <span style={{ color: '#9ca3af' }}>▾</span>
              </button>

              {showStatusDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 1100, minWidth: 220, background: '#fff', border: '1px solid #e6e9ef', borderRadius: 8, boxShadow: '0 8px 20px rgba(2,6,23,.08)', overflow: 'hidden' }}>
                  <button onClick={() => { setStatusFilter('all'); setShowStatusDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Todos los estados</span>
                    {statusFilter === 'all' && <span>✓</span>}
                  </button>
                  <button onClick={() => { setStatusFilter('active'); setShowStatusDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Activos</span>
                    {statusFilter === 'active' && <span>✓</span>}
                  </button>
                  <button onClick={() => { setStatusFilter('inactive'); setShowStatusDropdown(false); }} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <span>Inactivos</span>
                    {statusFilter === 'inactive' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9ecef' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--gris-oscuro)' }}>
            Lista de Usuarios
          </h3>
          <p style={{ margin: '4px 0 0', color: 'var(--gris-medio)', fontSize: '0.9rem' }}>
            {filteredUsers.length} usuarios encontrados
          </p>
        </div>
        <div className="scrollable-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gris-claro)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'var(--gris-oscuro)',
                      }}>
                        {getInitials(user.name)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: user.role === 'admin' ? '#d1fae5' : '#fee2e2',
                        color: user.role === 'admin' ? '#16a34a' : '#dc3545',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: user.status === 'active' ? '#d1fae5' : '#fee2e2',
                        color: user.status === 'active' ? '#16a34a' : '#dc3545',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditClick(user)}
                        style={{
                          background: 'none',
                          border: '1px solid #3b82f6',
                          color: '#3b82f6',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        style={{
                          background: 'none',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear Usuario */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px', color: 'var(--gris-oscuro)' }}>Crear Nuevo Usuario</h2>

            {modalSuccess && (
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#16a34a',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #16a34a',
              }}>
                ✅ Usuario creado exitosamente
              </div>
            )}

            {modalError && (
              <div className="login-error" style={{ marginBottom: '16px' }}>
                ❌ {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Rol</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || modalSuccess}
                  className="add-product-btn"
                  style={{ padding: '10px 20px', fontWeight: 'bold' }}
                >
                  {modalLoading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Usuario */}
      {showEditModal && editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px', color: 'var(--gris-oscuro)' }}>Editar Usuario</h2>

            {modalSuccess && (
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#16a34a',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #16a34a',
              }}>
                ✅ Usuario actualizado exitosamente
              </div>
            )}

            {modalError && (
              <div className="login-error" style={{ marginBottom: '16px' }}>
                ❌ {modalError}
              </div>
            )}

            <form onSubmit={handleUpdateUser}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Nombre</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Contraseña (deja vacío para no cambiar)</label>
                <input
                  type="password"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Rol</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Estado</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || modalSuccess}
                  className="add-product-btn"
                  style={{ padding: '10px 20px', fontWeight: 'bold' }}
                >
                  {modalLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}