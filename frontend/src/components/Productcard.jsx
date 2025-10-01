import { useState } from "react";

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  isOrganic,
  isNew,
  onProductClick
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onProductClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: "1 1 250px",
        border: "1px solid var(--gris-claro)",
        borderRadius: "12px",
        backgroundColor: "var(--blanco)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: hover
          ? "0 8px 20px rgba(0,0,0,0.2)"
          : "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Imagen con overlay */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "280px",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hover ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Etiquetas */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            display: "flex",
            gap: "6px",
          }}
        >
          {isNew && (
            <span
              style={{
                backgroundColor: "var(--verde-primario)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              Nuevo
            </span>
          )}
          {isOrganic && (
            <span
              style={{
                backgroundColor: "var(--naranja)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              Orgánico
            </span>
          )}
        </div>

        {/* Overlay oscuro */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: hover ? "rgba(0,0,0,0.4)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          {hover && (
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "var(--verde-primario)",
                color: "var(--blanco)",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🛒 Agregar al Carrito
            </button>
          )}
        </div>
      </div>

      {/* Info del producto */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ color: "var(--gris-oscuro)", fontSize: "1.1rem" }}>
          {name}
        </h3>
        <p style={{ color: "var(--gris-medio)", fontSize: "0.9rem" }}>
          {reviews} reseñas
        </p>

        {/* Estrellas */}
        <div style={{ margin: "8px 0", color: "gold", fontSize: "1rem" }}>
          {"⭐".repeat(Math.floor(rating))}
          {"☆".repeat(5 - Math.floor(rating))}
        </div>

        {/* Precio */}
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "var(--gris-oscuro)",
          }}
        >
          ${price}
        </p>
      </div>
    </div>
  );
}
