// src/components/Navbar.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Leaf } from 'lucide-react';
import '../style/navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  // Mock para el número de items en el carrito. Reemplázalo con tu contexto real.
  const cartItemCount = 3;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* IZQUIERDA: Logo + Links */}
        <div className="navbar-left">
          <div className="navbar-logo-wrapper">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo">
                <div className="navbar-logo-icon">
                  <Leaf className="navbar-logo-leaf" />
                </div>
                <span className="navbar-logo-text">EcoVestir</span>
              </div>
            </Link>
          </div>

          <nav className="navbar-links">
            <Link to="/" className="navbar-link">Inicio</Link>
            <Link to="/productos" className="navbar-link">Productos</Link>
            <Link to="/categorias" className="navbar-link">Categorías</Link>
            <Link to="/sobre-nosotros" className="navbar-link">Sobre Nosotros</Link>
            <Link to="/contacto" className="navbar-link">Contacto</Link>
          </nav>
        </div>

        {/* DERECHA: Buscador + Carrito + Auth */}
        <div className="navbar-right">
          <div className="navbar-search">
            <div className="navbar-search-wrapper">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="navbar-search-input"
              />
            </div>
          </div>

          <Link to="/carrito" className="navbar-cart-button">
            <ShoppingCart className="navbar-cart-icon" />
            {cartItemCount > 0 && (
              <span className="navbar-cart-badge">{cartItemCount}</span>
            )}
          </Link>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <button
                className="navbar-auth-button logout"
                onClick={handleLogout}
              >
                Cerrar Sesión ({user?.name})
              </button>
            ) : (
              <Link to="/login" className="navbar-auth-button login">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
