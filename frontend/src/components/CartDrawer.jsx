// src/components/CartDrawer.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useCart } from '../Context/useCart';
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, isUpdating } = useCart();

  const handleContinueShopping = () => {
    onClose();
    navigate('/productos');
  };

  const handleRemoveItem = (id) => {
    // Llamamos al contexto para sincronizar con el backend
    removeFromCart(id);
  };

  const handleUpdateQuantity = (uid, newQty) => {
    if (newQty < 0) return;
    updateCartItemQuantity(uid, newQty);
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
    clearCart();
  };

  const nodeRef = useRef(null);

  return (
    <>
      {isOpen && (
        <div className="cart-drawer-overlay" onClick={onClose}></div>
      )}

      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={300}
        classNames="cart-drawer"
        unmountOnExit
      >
        <div ref={nodeRef} className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h2 className="cart-drawer-title">
              <svg className="cart-drawer-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              Tu Carrito de Compras
            </h2>
            <button className="cart-drawer-close" onClick={onClose}>
              ×
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-drawer-content">
              <div className="cart-empty-state">
                <div className="cart-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                </div>
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
                  {cartItems.map((item, idx) => (
                    <div key={item.uid ?? item.id ?? `${item.name || 'item'}-${idx}`} className="cart-item">
                      <img 
                        src={item.image || '/placeholder.jpg'} 
                        alt={item.name} 
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />
                        <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        {/* {item.size && <div className="cart-item-size">Talla: <strong>{item.size}</strong></div>} */}
                        <div className="cart-item-tags">
                          <span className="cart-item-tag">Algodón Orgánico</span>
                          {item.size && <span className="cart-item-tag">Talla {item.size}</span>}
                        </div>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button 
                          className="cart-item-remove"
                          onClick={() => handleRemoveItem(item.uid ?? item.id)}
                          title="Eliminar producto"
                          disabled={isUpdating(item.uid ?? item.id)}
                          aria-busy={isUpdating(item.uid ?? item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                        <div className="cart-item-quantity-controls">
                          <button 
                            className="cart-item-btn"
                            onClick={() => handleUpdateQuantity(item.uid ?? item.id, item.quantity - 1)}
                            disabled={isUpdating(item.uid ?? item.id)}
                          >
                            –
                          </button>
                          <span className="cart-item-quantity">{item.quantity}</span>
                          <button 
                            className="cart-item-btn"
                            onClick={() => handleUpdateQuantity(item.uid ?? item.id, item.quantity + 1)}
                            disabled={isUpdating(item.uid ?? item.id)}
                          >
                            +
                          </button>
                        </div>
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