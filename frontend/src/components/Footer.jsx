export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--gris-oscuro)",
        color: "var(--blanco)",
        padding: "40px 20px",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "30px",
        }}
      >
        {/* Logo y descripción */}
        <div>
          <h2 style={{ color: "var(--verde-primario)", marginBottom: "15px" }}>
            EcoVestir
          </h2>
          <p style={{ color: "var(--gris-claro)", fontSize: "0.9rem" }}>
            Tienda online de productos sostenibles y ecológicos.  
            Compras responsables para un futuro más verde 🌱.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h3 style={{ marginBottom: "10px" }}>Enlaces</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/" style={linkStyle}>Inicio</a></li>
            <li><a href="/productos" style={linkStyle}>Productos</a></li>
            <li><a href="/nosotros" style={linkStyle}>Nosotros</a></li>
            <li><a href="/contacto" style={linkStyle}>Contacto</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 style={{ marginBottom: "10px" }}>Contacto</h3>
          <p style={{ fontSize: "0.9rem" }}>📍 Lima, Perú</p>
          <p style={{ fontSize: "0.9rem" }}>📧 contacto@EcoVestir.com</p>
          <p style={{ fontSize: "0.9rem" }}>📞 +51 987 654 321</p>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 style={{ marginBottom: "10px" }}>Síguenos</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="#" style={iconStyle}>🌐</a>
            <a href="#" style={iconStyle}>📘</a>
            <a href="#" style={iconStyle}>📸</a>
            <a href="#" style={iconStyle}>🐦</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: "1px solid var(--gris-medio)",
          marginTop: "30px",
          paddingTop: "15px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--gris-claro)",
        }}
      >
        © {new Date().getFullYear()} EcoVestir - Todos los derechos reservados.
      </div>
    </footer>
  );
}

const linkStyle = {
  color: "var(--gris-claro)",
  textDecoration: "none",
  fontSize: "0.9rem",
  display: "block",
  marginBottom: "8px",
  transition: "color 0.3s",
};

const iconStyle = {
  fontSize: "1.5rem",
  textDecoration: "none",
  color: "var(--blanco)",
  transition: "transform 0.3s",
};
