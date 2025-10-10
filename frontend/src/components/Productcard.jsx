// ProductCard.jsx

import { useState } from "react";
import { ShoppingCart } from 'lucide-react';
import "../style/productcard.css";

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  isOrganic,
  isNew,
  onProductClick,
  originalPrice, // opcional
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="product-card"
      onClick={onProductClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagen con overlay */}
      <div className="product-card-image-container">
        <img
          src={image}
          alt={name}
          className="product-card-image"
          style={{
            transform: hover ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Etiquetas */}
        <div className="product-card-badges">
          {isNew && (
            <span className="product-card-badge product-card-badge-nuevo">
              Nuevo
            </span>
          )}
          {isOrganic && (
            <span className="product-card-badge product-card-badge-organico">
              Orgánico
            </span>
          )}
        </div>

        {/* Overlay oscuro con botón */}
        <div className={`product-card-overlay ${hover ? "opacity-100" : ""}`}>
          <button className="product-card-add-button">
            <ShoppingCart className="h-4 w-4" />
            Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Info del producto */}
      <div className="product-card-content">
        <h3 className="product-card-title">{name}</h3>

        {/* Rating y reseñas */}
        <div className="product-card-rating">
          {"⭐".repeat(Math.floor(rating))}
          {"☆".repeat(5 - Math.floor(rating))}
          <span className="product-card-reviews">({reviews})</span>
        </div>

        {/* Precio */}
        <div className="product-card-price">
          ${price}
          {originalPrice && (
            <span className="product-card-price-original">${originalPrice}</span>
          )}
        </div>

        {/* Botón Ver Detalles */}
        {onProductClick && (
          <button
            className="product-card-details-button"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick();
            }}
          >
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
}