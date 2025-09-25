import ProductCard from "./Productcard";

export default function Productos() {
  const productos = [
    {
      nombre: "Camiseta Orgánica",
      descripcion: "Algodón 100% orgánico.",
      precio: 25,
      imagen:
        "https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbGluZW4lMjBzaGlydCUyMG5hdHVyYWwlMjBmYWJyaWN8ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      nuevo: true,
      organico: true,
      estrellas: 4,
    },
    {
      nombre: "Pantalón Sostenible",
      descripcion: "Material reciclado.",
      precio: 40,
      imagen:
        "https://images.unsplash.com/photo-1543121032-68865adeff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGhlbXAlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTc1NTAzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      nuevo: false,
      organico: true,
      estrellas: 5,
    },
  ];

  return (
    <section
      style={{ padding: "50px 20px", backgroundColor: "var(--blanco)" }}
    >
      <div className="container">
        <h2
          style={{
            color: "var(--verde-primario)",
            fontSize: "2rem",
            marginBottom: "20px",
          }}
        >
          Productos Destacados
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {productos.map((p, index) => (
            <ProductCard key={index} producto={p} />
          ))}
        </div>

        {/* Botón centrado */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              backgroundColor: "var(--verde-primario)",
              color: "var(--blanco)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  );
}
