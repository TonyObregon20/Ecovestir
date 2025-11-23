// src/pages/Admin/AdminPage.jsx
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Tag,
  Home,
  Hand
} from 'lucide-react';
import "../../index.css";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 Obtener datos del usuario desde localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 👇 Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Productos", icon: <Package size={20} /> },
    { path: "/admin/categories", label: "Categorías", icon: <Tag size={20} /> },
    { path: "/admin/Users", label: "Usuarios", icon: <Users size={20} /> },
    { path: "/admin/orders", label: "Pedidos", icon: <ShoppingCart size={20} /> },
    { path: "/admin/reports", label: "Reportes", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar compacto */}
      <aside className="admin-sidebar-compact">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="EcoVestir" className="logo-icon" />
          {/* <h2>EcoVestir</h2> */}
        </div>

        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className={isActive ? "active" : ""}>
                  <Link to={item.path}>
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link to="/" className="go-to-site-link">
          <Home size={20} />
          <span className="home-label">Ir al Sitio</span>
        </Link>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        <header className="admin-header">
          {/* 👇 Saludo personalizado con icono */}
          {user ? (
            <div className="admin-welcome">
              <h1>Bienvenido {user.name.charAt(0).toUpperCase() + user.name.slice(1)}  </h1>
              <Hand className="welcome-icon" />
            </div>
          ) : (
            <h1>Cargando...</h1>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>
        <section className={"admin-content" + (location.pathname === '/admin' ? ' admin-dashboard-grid' : '')}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}