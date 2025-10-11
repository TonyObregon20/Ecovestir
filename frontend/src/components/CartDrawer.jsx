// src/components/CartDrawer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importamos useNavigate
import { CSSTransition } from 'react-transition-group';
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate(); // 👈 Hook para navegar

  const handleContinueShopping = () => {
    onClose(); // Cierra el carrito
    navigate('/productos'); // Redirige a la página de productos
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

          <div className="cart-drawer-content">
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos orgánicos para comenzar</p>
              {/* 👇 Botón actualizado */}
              <button 
                className="cart-continue-button"
                onClick={handleContinueShopping}
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}

export default CartDrawer;