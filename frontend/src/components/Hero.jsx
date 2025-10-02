export default function Hero() {
  return (
    <section style={{padding: "64px 20px", backgroundColor: "#f0faf4"}}>
      <div className="container" style={{display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center"}}>
        <div style={{flex: "1 1 400px"}}>
          <h1 style={{fontSize: "2.5rem", fontWeight: "800", color: "var(--gris-oscuro)"}}>
            Ropa Orgánica
          </h1>
          <h2 style={{fontSize: "2.5rem", fontWeight: "800", color: "var(--verde-primario)", marginBottom: "24px"}}>
            Para un Futuro Sostenible
          </h2>
          <p style={{color: "var(--gris-medio)"}}>
            Descubre nuestra colección de ropa fabricada con materiales 100% orgánicos.
          </p>
          <div style={{display: "flex", gap: "16px", marginTop: "16px"}}>
            <button>Explorar Colección</button>
            <button style={{backgroundColor: "var(--blanco)", color: "var(--gris-oscuro)", border: "1px solid var(--gris-medio)"}}>
              Conoce Más
            </button>
          </div>
        </div>

        <div style={{flex: "1 1 400px"}}>
          <img src="https://images.unsplash.com/photo-1571773531692-414db6fc0328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwb3JnYW5pYyUyMGZhYnJpYyUyMHRleHR1cmV8ZW58MXx8fHwxNzU3NTUwMzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Ropa orgánica" 
          style={{  width: "100%",        // ancho de contenedor
    height: "400px",      // altura fija
    objectFit: "cover",   // recorta y hace zoom
    objectPosition: "top center", // qué parte mostrar
    borderRadius: "16px"}} />
        </div>
      </div>
    </section>
  );
}
