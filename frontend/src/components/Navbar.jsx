// src/components/Navbar.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { ShoppingCart, Leaf } from 'lucide-react';
import '../style/navbar.css';

export default function Navbar() {
  const cartItemCount = 3;

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

          {/* DERECHA: Buscador + Carrito */}
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

            <Link to="/login" className="navbar-auth-button login">
                Iniciar Sesión
            </Link>
          </div>
        </div>
    </header>
  );
}