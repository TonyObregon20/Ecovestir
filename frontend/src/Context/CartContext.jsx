// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

// 👇 Función para obtener el carrito desde localStorage
const getCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('No se pudo leer el carrito de localStorage', e);
    return [];
  }
};

// 👇 Función para guardar en localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('No se pudo guardar el carrito en localStorage', e);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getCartFromStorage()); // 👈 Inicializa desde localStorage

  // 👇 Guarda en localStorage cada vez que el carrito cambie
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, getCartTotal, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};