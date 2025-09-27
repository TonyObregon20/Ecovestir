// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'; // Importamos el hook

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src="/img/logo.png" alt="EcoVestir" className="logo" />
        <span className="logo-text">EcoVestir</span>
      </div>
      <nav className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/categorias">Categorías</Link>
        <Link to="/sobre-nosotros">Sobre Nosotros</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
      <div className="navbar-actions">
        <input type="text" placeholder="Buscar..." className="search-input" />
        <button className="cart-button">🛒</button>
        {/* Botón dinámico de login/logout */}
        {isAuthenticated ? (
          <button className="auth-button logout" onClick={logout}>
            Cerrar Sesión ({user?.name})
          </button>
        ) : (
          <Link to="/login" className="auth-button login">Iniciar Sesión</Link>
        )}
      </div>
    </header>
  );
}