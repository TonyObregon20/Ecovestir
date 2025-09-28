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
  X,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  User as UserIcon,
  Leaf,
  Truck,
  CircleCheck,
  Clock,
  ArrowUp,
  ArrowDown,
  House
} from 'lucide-react';
import "../style/admin.css"; // Importamos los estilos

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', sublabel: '', path: '/admin', key: 'dashboard' },
    { icon: Users, label: 'Clientes', sublabel: '', path: '/admin/users', key: 'users' },
    { icon: Package, label: 'Productos', sublabel: '', path: '/admin/products', key: 'products' },
    { icon: ShoppingCart, label: 'Pedidos', sublabel: '', path: '/admin/orders', key: 'orders' },
    { icon: BarChart3, label: 'Reportes', sublabel: '', path: '/admin/reports', key: 'reports' },
    { icon: Settings, label: 'Configuración', sublabel: '', path: '/admin/settings', key: 'settings' },
  ];

  const metricCards = [
    { title: 'Ingresos', value: '$45,231.89', change: '+20.1% vs mes anterior', icon: DollarSign, positive: true },
    { title: 'Pedidos', value: '+12,234', change: '+180.1% vs mes anterior', icon: ShoppingBag, positive: true },
    { title: 'Productos', value: '+573', change: '+19% vs mes anterior', icon: Package, positive: true },
    { title: 'Clientes', value: '+2,350', change: '+201% vs mes anterior', icon: UserIcon, positive: true }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Carlos García', date: '2024-01-15', price: '$299.00', status: 'completed' },
    { id: '#ORD-002', customer: 'María López', date: '2024-01-14', price: '$189.00', status: 'processing' },
    { id: '#ORD-003', customer: 'Pedro Martínez', date: '2024-01-14', price: '$89.00', status: 'sent' },
    { id: '#ORD-004', customer: 'Ana Rodríguez', date: '2024-01-13', price: '$349.00', status: 'completed' },
    { id: '#ORD-005', customer: 'Luis Fernández', date: '2024-01-13', price: '$156.00', status: 'processing' }
  ];

  const productStats = {
    total: 1234,
    inStock: 1169,
    lowStock: 65,
    percentage: 95
  };

  const sustainabilityMetrics = [
    { value: '98%', label: 'Materiales Reciclados' },
    { value: '95%', label: 'Energía Renovable' },
    { value: '100%', label: 'Embalaje Sostenible' },
    { value: '92%', label: 'Reducción de CO2' }
  ];

  return (
    <div className={`admin-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <Leaf size={16} />
          </div>
          <div>
            <h1 className="admin-sidebar-title">EcoVestir</h1>
            <p className="admin-sidebar-subtitle">Panel de Administración</p>
          </div>
        </div>

        <a href="/" className="admin-sidebar-btn-site">
          <House className="admin-sidebar-btn-site-icon" size={16} />
          Ir al Sitio
        </a>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`admin-sidebar-item ${window.location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon className="admin-sidebar-item-icon" size={20} />
              <div>
                <span className="admin-sidebar-item-label">{item.label}</span>
                <span className="admin-sidebar-item-sublabel">{item.sublabel}</span>
              </div>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={logout}
            className="admin-sidebar-logout"
          >
            <LogOut className="admin-sidebar-logout-icon" size={20} />
            <span className="admin-sidebar-logout-label">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">Dashboard</h1>
          <div className="admin-user-info">
            <p className="admin-user-name">Bienvenido, {user?.name}</p>
            <div className="admin-user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="admin-content">
          {/* Metric Cards */}
          <div className="metric-cards">
            {metricCards.map((card, index) => (
              <div key={index} className="metric-card">
                <div className="metric-card-header">
                  <h3 className="metric-card-title">{card.title}</h3>
                  <card.icon className="metric-card-icon" size={24} />
                </div>
                <p className="metric-card-value">{card.value}</p>
                <p className={`metric-card-change ${card.positive ? '' : 'negative'}`}>
                  {card.change}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="recent-orders">
            <div className="recent-orders-header">
              <h2 className="recent-orders-title">Pedidos Recientes</h2>
              <ShoppingCart className="recent-orders-icon" size={20} />
            </div>
            {recentOrders.map((order, index) => (
              <div key={index} className="order-item">
                <div>
                  <p className="order-id">{order.id}</p>
                  <p className="order-customer">{order.customer}</p>
                </div>
                <p className="order-date">{order.date}</p>
                <p className="order-price">{order.price}</p>
                <span className={`order-status ${order.status}`}>
                  {order.status === 'completed' && 'Completado'}
                  {order.status === 'processing' && 'Procesando'}
                  {order.status === 'sent' && 'Enviado'}
                </span>
              </div>
            ))}
          </div>

          {/* Product Management */}
          <div className="product-management">
            <div className="product-management-header">
              <Package className="product-management-icon" size={20} />
              <h2 className="product-management-title">Gestión de Productos</h2>
            </div>
            <p className="product-management-description">
              Estás gestionando {productStats.total} productos, con {productStats.inStock} en stock y {productStats.lowStock} con bajo stock.
            </p>
            <div className="product-management-stats">
              <div className="product-management-stat">
                <span className="product-management-stat-value">{productStats.inStock}</span>
                <span className="product-management-stat-label">En Stock</span>
              </div>
              <div className="product-management-stat">
                <span className="product-management-stat-value">{productStats.lowStock}</span>
                <span className="product-management-stat-label">Bajo Stock</span>
              </div>
              <div className="product-management-stat">
                <span className="product-management-stat-value">{productStats.total}</span>
                <span className="product-management-stat-label">Total</span>
              </div>
            </div>
            <div className="product-management-progress">
              <div className="product-management-progress-bar" style={{ width: `${productStats.percentage}%` }}></div>
            </div>
          </div>

          {/* Sustainability Metrics */}
          <div className="sustainability-metrics">
            <div className="sustainability-metrics-header">
              <Leaf className="sustainability-metrics-icon" size={20} />
              <h2 className="sustainability-metrics-title">Métricas de Sostenibilidad</h2>
            </div>
            <div className="sustainability-metrics-grid">
              {sustainabilityMetrics.map((metric, index) => (
                <div key={index} className="sustainability-metric">
                  <span className="sustainability-metric-value">{metric.value}</span>
                  <span className="sustainability-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;