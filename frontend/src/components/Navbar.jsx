import { Link } from "react-router-dom";

export default function Navbar() {
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
      </div>
    </header>
  );
}
