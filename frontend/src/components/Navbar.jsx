// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, LogOut, User, Settings } from 'lucide-react';
import api from '../api/api';
import { useCart } from '../Context/useCart'; 
import "../style/navbar.css";

export default function Navbar({ onCartClick }) {
  const { getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = getCartTotal();

  const [searchText, setSearchText] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef(null);
  
  // const [suggestionsLoading, setSuggestionsLoading] = React.useState(false);
  // Keep navbar input in sync with ?q= on productos route
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchText(q);
  }, [location.search]);

  // Debounced suggestions fetch
  React.useEffect(() => {
    const q = searchText.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    // setSuggestionsLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await api.get(`/api/products?q=${encodeURIComponent(q)}&limit=5`);
        const data = res.data && res.data.data ? res.data.data : res.data;
        setSuggestions(data || []);
      } catch (err) {
        console.error('Error loading suggestions', err);
        setSuggestions([]);
      } finally {
        // setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchText]);

  const user = JSON.parse(localStorage.getItem('user'));

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearCart();
    setShowUserMenu(false);
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
          <Link to="/blog" className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}>Blog</Link>
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = searchText.trim();
                    if (q.length > 0) navigate(`/productos?q=${encodeURIComponent(q)}`);
                    else navigate('/productos');
                  }
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              />
              {searchFocused && suggestions && suggestions.length > 0 && (
                <ul className="navbar-suggestions" onMouseDown={(e) => e.preventDefault()}>
                  {suggestions.map((p) => (
                    <li key={p._id} className="navbar-suggestion-item" onClick={() => {
                      navigate(`/producto/${p._id}`);
                      setSuggestions([]);
                      setSearchText('');
                    }}>
                      <img src={(p.images && p.images.length) ? p.images[0] : (p.imagen || '/placeholder.jpg')} alt={p.name || p.nombre || ''} />
                      <div className="navbar-suggestion-body">
                        <div className="navbar-suggestion-name">{p.name || p.nombre}</div>
                        <div className="navbar-suggestion-price">${(p.price || p.precio || 0).toFixed ? (p.price || p.precio || 0).toFixed(2) : (p.price || p.precio || 0)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
            <div className="navbar-user-info" ref={userMenuRef}>
              {user.role === 'admin' ? (
                <Link to="/admin" className="navbar-admin-icon-btn" title="Panel de Admin">
                  <Settings size={20} />
                </Link>
              ) : (
                <>
                  <div 
                    className="navbar-user-avatar" 
                    title={user.name}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {showUserMenu && (
                    <div className="navbar-user-dropdown">
                      <div className="navbar-user-dropdown-header">
                        <span className="navbar-user-dropdown-greeting">¡Hola, {user.name}!</span>
                      </div>
                      <div className="navbar-user-dropdown-divider"></div>
                      <button className="navbar-user-dropdown-item" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-auth-button login" title="Iniciar Sesión">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}