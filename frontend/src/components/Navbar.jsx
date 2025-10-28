// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import "../style/navbar.css";

export default function Navbar({ onCartClick }) {
  const { getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = getCartTotal();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearCart();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo-wrapper">
          <Link to="/" className="navbar-logo-link">
            <img src="/logo.png" alt="EcoVestir Logo" className="navbar-logo-img" />
          </Link>
          <Link to="/" className="navbar-logo-text-link">
            <span className="navbar-logo-text">EcoVestir</span>
          </Link>
        </div>

        {/* LINKS CENTRO */}
        <nav className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
          <Link to="/productos" className={`navbar-link ${isActive('/productos') ? 'active' : ''}`}>Productos</Link>
          <Link to="/categorias" className={`navbar-link ${isActive('/categorias') ? 'active' : ''}`}>Categorías</Link>
          <Link to="/sobre-nosotros" className={`navbar-link ${isActive('/sobre-nosotros') ? 'active' : ''}`}>Sobre Nosotros</Link>
          <Link to="/contacto" className={`navbar-link ${isActive('/contacto') ? 'active' : ''}`}>Contacto</Link>
        </nav>

        {/* DERECHA: Buscador + Carrito + Auth */}
        <div className="navbar-right">
          <div className="navbar-search">
            <div className="navbar-search-wrapper">
              <Search className="navbar-search-icon" size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="navbar-search-input"
              />
            </div>
          </div>

          <button 
            className="navbar-cart-button" 
            onClick={onCartClick}
            aria-label="Ver carrito"
          >
            <ShoppingCart className="navbar-cart-icon" />
            {cartItemCount > 0 && (
              <span className="navbar-cart-badge">{cartItemCount}</span>
            )}
          </button>

          {user ? (
            <div className="navbar-user-info">
              {user.role === 'admin' ? (
                <Link to="/admin" className="navbar-auth-button admin">
                  Panel de Admin
                </Link>
              ) : (
                <span className="navbar-user-greeting">
                  Hola, <strong>{user.name}</strong>
                </span>
              )}
              <button 
                className="navbar-logout-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-auth-button login">
              <User size={18} />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}