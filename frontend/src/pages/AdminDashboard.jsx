// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import "../style/admin.css"; // Importamos los estilos

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin', key: 'dashboard' },
    { icon: Users, label: 'Usuarios', path: '/admin/users', key: 'users' },
    { icon: Package, label: 'Productos', path: '/admin/products', key: 'products' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/orders', key: 'orders' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reports', key: 'reports' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings', key: 'settings' },
  ];

  return (
    <div className={`admin-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="admin-sidebar-header">
          <h1 className={`admin-sidebar-title ${sidebarOpen ? '' : 'collapsed'}`}>Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-sidebar-toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="admin-sidebar-item"
            >
              <item.icon className="admin-sidebar-item-icon" size={20} />
              <span className={`admin-sidebar-item-label ${sidebarOpen ? '' : 'collapsed'}`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={logout}
            className="admin-sidebar-logout"
          >
            <LogOut className="admin-sidebar-logout-icon" size={20} />
            <span className={`admin-sidebar-logout-label ${sidebarOpen ? '' : 'collapsed'}`}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">Panel de Administración</h1>
          <div className="admin-user-info">
            <p className="admin-user-name">Bienvenido, {user?.name}</p>
            <div className="admin-user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="admin-content">
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-icon users">
                <Users size={24} />
              </div>
              <p className="admin-card-title">Usuarios</p>
              <p className="admin-card-value">1,234</p>
              <p className="admin-card-footer">Total registrados</p>
            </div>
            
            <div className="admin-card">
              <div className="admin-card-icon products">
                <Package size={24} />
              </div>
              <p className="admin-card-title">Productos</p>
              <p className="admin-card-value">567</p>
              <p className="admin-card-footer">En catálogo</p>
            </div>
            
            <div className="admin-card">
              <div className="admin-card-icon orders">
                <ShoppingCart size={24} />
              </div>
              <p className="admin-card-title">Ventas</p>
              <p className="admin-card-value">$12,345</p>
              <p className="admin-card-footer">Este mes</p>
            </div>
          </div>

          <div className="admin-recent-activity">
            <h2>Actividad Reciente</h2>
            <div className="admin-activity-item">
              <div className="admin-activity-icon users">
                <Users size={20} />
              </div>
              <div className="admin-activity-info">
                <p className="admin-activity-title">Nuevo usuario registrado</p>
                <p className="admin-activity-time">Hace 5 minutos</p>
              </div>
            </div>
            <div className="admin-activity-item">
              <div className="admin-activity-icon orders">
                <ShoppingCart size={20} />
              </div>
              <div className="admin-activity-info">
                <p className="admin-activity-title">Nueva orden recibida</p>
                <p className="admin-activity-time">Hace 10 minutos</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;