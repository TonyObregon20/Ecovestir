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

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Cargar carrito desde el backend
  const loadCart = async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        // Formateamos para que coincida con lo que espera ProductCard
        const formattedCart = cartData.map((item) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity,
        }));
        setCartItems(formattedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Añadir producto al carrito
  const addToCart = async (product) => {
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        // Recargamos el carrito completo para mantener sincronización
        await loadCart();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'No se pudo agregar el producto al carrito.');
      }
    } catch (error) {
      console.error('Error en addToCart:', error);
      alert('Error de conexión. ¿Está corriendo el backend?');
    }
  };

  // Obtener total de items (para badge en navbar)
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Función para recargar el carrito (útil tras login/logout)
  const refetchCart = () => {
    loadCart();
  };

  // 👇 FUNCIÓN PARA LIMPIAR EL CARRITO EN LA UI
  const clearCart = () => {
    setCartItems([]);
  };

  // Cargar carrito al montar el proveedor
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartTotal,
        loading,
        refetchCart,
        clearCart, // 👈 ¡INCLUIDA AQUÍ!
      }}
    >
      {children}
    </CartContext.Provider>
  );
};