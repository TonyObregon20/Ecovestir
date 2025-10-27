// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Leaf, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import "../style/navbar.css";

export default function Navbar({ onCartClick }) {
  const { getCartTotal, clearCart } = useCart(); // añadido clearCart
  const navigate = useNavigate();
  const cartItemCount = getCartTotal();

  // 👇 Obtener usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // 1. Limpiar datos de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Limpiar el carrito en la UI (¡sin recargar!)
    clearCart();
    
    // 3. Redirigir
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* IZQUIERDA: Logo + Links */}
        <div className="navbar-left">
          <div className="navbar-logo-wrapper">
            <Link to="/" className="navbar-logo-link">
              <img src="/logo.png" alt="EcoVestir Logo" className="navbar-logo-img" />
            </Link>
            <Link to="/" className="navbar-logo-text-link">
              <span className="navbar-logo-text">EcoVestir</span>
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
            // Usuario autenticado
            <div className="navbar-user-info">
              {user.role === 'admin' ? (
                <Link to="/admin" className="navbar-auth-button admin">
                  Panel de Admin
                </Link>
              ) : (
                // Vista para customer
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
            // No autenticado
            <Link to="/login" className="navbar-auth-button login">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}