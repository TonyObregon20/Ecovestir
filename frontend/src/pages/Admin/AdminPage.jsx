// src/pages/Admin/AdminPage.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Home
} from 'lucide-react';
import "../../index.css";

export default function AdminPage() {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Productos", icon: <Package size={20} /> },
    { path: "/admin/users", label: "Usuarios", icon: <Users size={20} /> },
    { path: "/admin/orders", label: "Pedidos", icon: <ShoppingCart size={20} /> },
    { path: "/admin/reports", label: "Reportes", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar compacto */}
      <aside className="admin-sidebar-compact">
        <div className="sidebar-logo">
          <span className="logo-icon">🍃</span>
          <h2>EcoVestir</h2>
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
          <h1>Panel de Administración</h1>
          <button className="btn-logout">Cerrar sesión</button>
        </header>
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}