// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarProductos } from '../api/products';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/productDetail.css';
import { ShoppingCart, Star, StarHalf, ArrowLeft, Truck, Shield, RefreshCw, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listarProductos(id);
        // Normalizar tallas: aceptar array o string separado por comas
        const normalizeSizes = (raw) => {
          if (!raw) return [];
          if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
          if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
          // Fallback: intentar convertir a string
          return String(raw).split(',').map(s => s.trim()).filter(Boolean);
        };

        const normalizedSizes = normalizeSizes(data.sizes);

        // Guardar el producto y reemplazar sizes por la versión normalizada
        setProduct({ ...data, sizes: normalizedSizes });

        if (normalizedSizes.length > 0) {
          setSelectedSize(normalizedSizes[0]); // Selecciona la primera talla disponible
        } else {
          setSelectedSize('');
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Cargando producto...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  // Datos para mostrar
  const material = product.material || 'Algodón Orgánico';
  // Asegurarse de trabajar con la versión normalizada de tallas
  const sizes = Array.isArray(product.sizes) ? product.sizes : (product.sizes ? [product.sizes] : []);
  const stock = product.stock !== undefined ? product.stock : 0;
  const ecoFriendly = product.ecoFriendly !== undefined ? product.ecoFriendly : true;

  // Características (puedes personalizarlas según tu producto o traerlas desde la DB)
  const features = [
    'Material 100% orgánico certificado',
    'Libre de químicos nocivos',
    'Transpirable y cómodo',
    'Resistente al lavado',
    'Tinte natural sin productos químicos',
    'Comercio justo y ético'
  ];

  // Cuidado de la prenda
  const careInstructions = [
    'Lavar en agua fría (máximo 30°C)',
    'Usar detergente suave y biodegradable',
    'No usar blanqueador',
    'Secar al aire libre, evitar secadora'
  ];

  // Renderizar estrellas de rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="star full" size={18} fill="#FFD700" color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="star half" size={18} fill="#FFD700" color="#FFD700" />);
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" size={18} fill="#ddd" color="#ddd" />);
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        {/* Botón de volver con estilo de tarjeta */}
        <button className="back-button-card-style" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver a Productos
        </button>

        <div className="product-detail-main">
          {/* Imagen */}
          <div className="product-detail-image">
            <div className="product-card-badges">
              {product.isNew && (
                <span className="product-card-badge product-card-badge-nuevo">Nuevo</span>
              )}
              {ecoFriendly && (
                <span className="product-card-badge product-card-badge-organico">Orgánico</span>
              )}
            </div>
            <img src={product.images[0] || product.image} alt={product.name} className="product-card-image" />
          </div>

          {/* Información del producto */}
          <div className="product-detail-info">
            <h1 className="product-card-title">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="stars">
                {renderRating(product.rating)}
              </div>
              <span className="product-card-reviews">({product.reviews || product.reviewsCount || 0} reseñas)</span>
            </div>

            {/* Precio */}
            <div className="price-section">
              <span className="current-price product-card-price">${product.price}</span>
            </div>

            {/* Selector de tallas */}
            <div className="size-selector">
              <label>Talla:</label>
              <div className="size-buttons">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock <= 0}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="material-section">
              <strong>Material:</strong>
              <p>{material}</p>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button
                className="add-cart-btn"
                onClick={() => addToCart({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  size: selectedSize,
                  quantity: 1
                })}
                disabled={stock <= 0}
              >
                <ShoppingCart size={18} /> Agregar al Carrito
              </button>
              <button 
                className={`add-favorites-btn ${isFavorite ? 'favorite-active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
                disabled={stock <= 0}
              >
                <Heart size={18} fill={isFavorite ? "#dc2626" : "none"} color={isFavorite ? "#dc2626" : "currentColor"} />
                {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
              </button>
            </div>

            {/* Descripción */}
            <h2>Descripción:</h2>
            <p>{product.description}</p>

            {/* Características */}
            <h2>Características:</h2>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            {/* Cuidado de la prenda */}
            <h2>Cuidado de la prenda:</h2>
            <ul className="care-list">
              {careInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Banner inferior con iconos de lucide-react */}
        <div className="product-footer">
          <div className="footer-item">
            <Truck className="icon" size={32} color="#16a34a" />
            <div className="text">
              <strong>Envío Gratis</strong>
              En compras +$100
            </div>
          </div>
          <div className="footer-item">
            <Shield className="icon" size={32} color="#16a34a" />
            <div className="text">
              <strong>Garantía</strong>
              30 días
            </div>
          </div>
          <div className="footer-item">
            <RefreshCw className="icon" size={32} color="#16a34a" />
            <div className="text">
              <strong>Cambios</strong>
              Sin costo
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}