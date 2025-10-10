// src/pages/Admin/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
      const response = await fetch('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsers(data);
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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filter === 'all' || 
                        (filter === 'admin' && user.role === 'admin') ||
                        (filter === 'customer' && user.role === 'customer');
    return matchesSearch && matchesRole;
  });

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
      const response = await fetch('http://localhost:4000/api/users', {
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
      const response = await fetch(`http://localhost:4000/api/users/${editingUser._id}`, {
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
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
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
      <div className="formulario-producto" style={{ marginBottom: '24px' }}>
        <h2>Filtros</h2>
        <p style={{ color: 'var(--gris-medio)', marginBottom: '16px' }}>Busca y filtra usuarios</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label>Buscar por nombre o email</label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez o juan@example.com"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                backgroundColor: filter === 'all' ? 'var(--verde-primario)' : 'white',
                color: filter === 'all' ? 'white' : 'var(--gris-oscuro)',
                border: filter === 'all' ? 'none' : '1px solid var(--gris-medio)',
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('admin')}
              style={{
                backgroundColor: filter === 'admin' ? 'var(--verde-primario)' : 'white',
                color: filter === 'admin' ? 'white' : 'var(--gris-oscuro)',
                border: filter === 'admin' ? 'none' : '1px solid var(--gris-medio)',
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Admin
            </button>
            <button
              onClick={() => setFilter('customer')}
              style={{
                backgroundColor: filter === 'customer' ? 'var(--verde-primario)' : 'white',
                color: filter === 'customer' ? 'white' : 'var(--gris-oscuro)',
                border: filter === 'customer' ? 'none' : '1px solid var(--gris-medio)',
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Customer
            </button>
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