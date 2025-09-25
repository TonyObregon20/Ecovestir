export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src="/img/logo.png" alt="EcoVestir" className="logo" />
        <span className="logo-text">EcoVestir</span>
      </div>
      <nav className="navbar-links">
        <a href="#">Inicio</a>
        <a href="#">Productos</a>
        <a href="#">Categorías</a>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Contacto</a>
      </nav>
      <div className="navbar-actions">
        <input type="text" placeholder="Buscar..." className="search-input" />
        <button className="cart-button">🛒</button>
      </div>
    </header>
  );
}
