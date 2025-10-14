// src/components/CartDrawer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const handleContinueShopping = () => {
    onClose();
    navigate('/productos');
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      {isOpen && (
        <div className="cart-drawer-overlay" onClick={onClose}></div>
      )}

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="cart-drawer"
        unmountOnExit
      >
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h2 className="cart-drawer-title">
              <span className="cart-drawer-icon">🛒</span>
              Tu Carrito de Compras
            </h2>
            <button className="cart-drawer-close" onClick={onClose}>
              ×
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-drawer-content">
              <div className="cart-empty-state">
                <div className="cart-empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos orgánicos para comenzar</p>
                <button 
                  className="cart-continue-button"
                  onClick={handleContinueShopping}
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-items-scrollable">
                <div className="cart-items-header">
                  <p>{getCartTotal()} artículo(s) en tu carrito</p>
                </div>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img 
                        src={item.image || '/placeholder.jpg'} 
                        alt={item.name} 
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                          e.target.onerror = null; // 👈 Evita bucle infinito
                        }}
                      />
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <div className="cart-item-tags">
                          <span className="cart-item-tag">Algodón Orgánico</span>
                          <span className="cart-item-tag">Talla S</span>
                        </div>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button 
                          className="cart-item-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          –
                        </button>
                        <span className="cart-item-quantity">{item.quantity}</span>
                        <button 
                          className="cart-item-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          className="cart-item-remove"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="cart-shipping-info">
                  Envío e impuestos calculados al finalizar compra
                </p>
                <button 
                  className="cart-proceed-button"
                  onClick={handleProceedToCheckout}
                >
                  Proceder al Pago
                </button>
                <button 
                  className="cart-continue-button"
                  onClick={handleContinueShopping}
                >
                  Continuar Comprando
                </button>
                <button 
                  className="cart-clear-button"
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </>
  );
}

export default CartDrawer;