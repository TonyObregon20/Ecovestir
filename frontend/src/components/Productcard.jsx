// src/components/ProductCard.jsx
import { useState } from "react";
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext'; // 👈 Importa el hook
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
  originalPrice,
}) {
  const [hover, setHover] = useState(false);
  const { addToCart } = useCart(); // 👈 Obtén la función

  // 👇 Nueva función para agregar al carrito
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que se dispare onProductClick
    addToCart({ id, name, price, image }); // Envía los datos del producto
  };

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
          <button 
            className="product-card-add-button"
            onClick={handleAddToCart} // 👈 Asigna la función
          >
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
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={index < Math.floor(rating) ? "star-filled" : "star-empty"}
              fill={index < Math.floor(rating) ? "#fbbf24" : "none"}
              stroke={index < Math.floor(rating) ? "#fbbf24" : "#d1d5db"}
            />
          ))}
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