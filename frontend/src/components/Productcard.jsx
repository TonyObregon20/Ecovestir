// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import '../style/productCard.css';

const ProductCard = ({ 
  producto,
  onProductClick
}) => {
  const [hover, setHover] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Aseguramos que los valores existan y sean válidos
  const {
    _id,
    nombre = 'Producto sin nombre',
    descripcion = '',
    precio = 0,
    imagen = 'https://via.placeholder.com/400x400?text=No+Image',
    nuevo = false,
    organico = false,
    estrellas = 0
  } = producto || {};

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    // Simular agregar al carrito
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(producto);
    }
  };

  // Función segura para renderizar estrellas
  const renderStars = (rating) => {
    // Aseguramos que rating sea un número válido entre 0 y 5
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - fullStars;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill="currentColor" 
            style={{ color: "#f59e0b" }}
          />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill="none" 
            stroke="currentColor" 
            style={{ color: "#d1d5db" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleProductClick}
      style={{
        flex: "1 1 250px",
        border: "1px solid var(--gris-claro)",
        borderRadius: "8px",
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
        position: "relative"
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
          src={imagen}
          alt={nombre}
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
          {nuevo && (
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
          {organico && (
            <span
              style={{
                backgroundColor: "var(--verde-claro)",
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

        {/* Botón de favorito */}
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--gris-medio)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--gris-oscuro)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            opacity: hover ? 1 : 0,
            transform: hover ? "translateY(0)" : "translateY(-10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={16} />
        </button>

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
              onClick={handleAddToCart}
              disabled={isAdding}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "var(--verde-primario)",
                color: "var(--blanco)",
                border: "none",
                fontWeight: "bold",
                cursor: isAdding ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShoppingCart size={16} />
              {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
            </button>
          )}
        </div>
      </div>

      {/* Info del producto */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ 
          color: "var(--gris-oscuro)", 
          fontSize: "1.1rem", 
          margin: "0 0 8px 0",
          fontWeight: "500"
        }}>
          {nombre}
        </h3>

        {/* Estrellas */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "4px", 
          marginBottom: "8px"
        }}>
          {renderStars(estrellas)}
          <span style={{ 
            color: "var(--gris-medio)", 
            fontSize: "0.9rem" 
          }}>
            ({Math.floor(Math.random() * 100) + 10})
          </span>
        </div>

        {/* Precio */}
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "var(--gris-oscuro)",
            margin: "8px 0 0 0",
          }}
        >
          ${precio}
        </p>

        {/* Botón de ver detalles */}
        {onProductClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              color: "var(--verde-primario)",
              border: "1px solid var(--verde-primario)",
              cursor: "pointer",
              fontWeight: "500",
              marginTop: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--verde-primario)";
              e.target.style.color = "var(--blanco)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "var(--verde-primario)";
            }}
          >
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;