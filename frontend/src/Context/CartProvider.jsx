import React, { useState, useEffect, useRef } from 'react';
import { CartContext } from './cartContext';

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState([]);
  const pendingUpdatesRef = useRef({});

  const getToken = () => localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const mapServerCart = (cartData) => cartData.map((item) => {
    const prodId = item.productId._id;
    const sizeFromServer = item.size || '';
    return {
      uid: `${prodId}::${sizeFromServer}`,
      id: prodId,
      size: sizeFromServer,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.images && item.productId.images.length ? item.productId.images[0] : '/placeholder.jpg',
      quantity: item.quantity,
    };
  });

  const loadCart = async () => {
    const token = getToken();
    if (!token) { setCartItems([]); setLoading(false); return; }

    try {
      const res = await fetch(`${baseURL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const cartData = await res.json();
        setCartItems(mapServerCart(cartData));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('loadCart error', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart: reserve then persist cart line (optimistic UI)
  const addToCart = async (product) => {
    const token = getToken();
    if (!token) { alert('Debes iniciar sesión para agregar productos al carrito.'); return false; }
    setIsCartOpen(true);

    const prevItems = cartItems;
    const prodId = product.id || product._id;
    const size = product.size || '';
    const uid = `${prodId}::${size}`;
    const existing = cartItems.find((it) => it.uid === uid);
    const optimistic = existing
      ? cartItems.map((it) => (it.uid === uid ? { ...it, quantity: it.quantity + 1 } : it))
      : [...cartItems, { uid, id: prodId, size, name: product.name, price: product.price, image: product.image || '/placeholder.jpg', quantity: 1 }];
    setCartItems(optimistic);

    try {
      const resReserve = await fetch(`${baseURL}/api/reservations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: prodId, size, quantity: 1 }),
      });
      if (!resReserve.ok) {
        const err = await resReserve.json().catch(() => ({}));
        setCartItems(prevItems);
        alert(err.message || 'No hay stock disponible para reservar');
        return false;
      }

      const res = await fetch(`${baseURL}/api/cart/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: prodId, quantity: 1, size }),
      });

      if (res.ok) {
        const cartData = await res.json();
        setCartItems(mapServerCart(cartData));
        return true;
      }

      const errorData = await res.json().catch(() => ({}));
      // persist failed: release reservation
      await fetch(`${baseURL}/api/reservations`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: prodId, size }),
      }).catch(() => {});
      setCartItems(prevItems);
      alert(errorData.message || 'No se pudo agregar el producto al carrito.');
      return false;
    } catch (err) {
      console.error('addToCart error', err);
      setCartItems(prevItems);
      alert('Error de conexión.');
      return false;
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  const markUpdating = (id) => setUpdatingItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const unmarkUpdating = (id) => setUpdatingItems((prev) => prev.filter((x) => x !== id));
  const isUpdating = (id) => updatingItems.includes(id);

  const getCartTotal = () => cartItems.reduce((t, i) => t + i.quantity, 0);
  const refetchCart = () => loadCart();

  // remove: release reservation then remove from server cart
  const removeFromCart = async (productIdOrUid) => {
    let size = '';
    let prodId = productIdOrUid;
    if (typeof productIdOrUid === 'string' && productIdOrUid.includes('::')) [prodId, size] = productIdOrUid.split('::');
    const token = getToken();
    if (!token) { alert('Debes iniciar sesión'); return; }

    const prevItems = cartItems;
    const uidToRemove = size ? `${prodId}::${size}` : null;
    const optimistic = size ? cartItems.filter((it) => it.uid !== uidToRemove) : cartItems.filter((it) => it.id !== prodId);
    setCartItems(optimistic);

    try {
      // release reservation
      await fetch(`${baseURL}/api/reservations`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: prodId, size }),
      }).catch(() => {});
      const url = `${baseURL}/api/cart/items/${prodId}${size ? `?size=${encodeURIComponent(size)}` : ''}`;
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const body = await res.json().catch(() => null);
        if (Array.isArray(body)) { setCartItems(mapServerCart(body)); return; }
        await loadCart();
        return;
      }

      const err = await res.json().catch(() => ({}));
      console.error('removeFromCart server error', err);
      setCartItems(prevItems);
      alert(err.message || 'No se pudo eliminar el producto del carrito.');
    } catch (err) {
      console.error('removeFromCart error', err);
      setCartItems(prevItems);
      alert('Error de conexión.');
    }
  };

  // update quantity: debounced - release old reservations, reserve new qty, and persist cart
  const updateCartItemQuantity = async (productIdOrUid, newQty) => {
    let size = '';
    let prodId = productIdOrUid;
    if (typeof productIdOrUid === 'string' && productIdOrUid.includes('::')) [prodId, size] = productIdOrUid.split('::');
    const token = getToken();
    if (!token) { alert('Debes iniciar sesión'); return; }

    const prevItems = cartItems;
    const uidKey = size ? `${prodId}::${size}` : null;
    if (newQty <= 0) {
      setCartItems((items) => (size ? items.filter((it) => it.uid !== uidKey) : items.filter((it) => it.id !== prodId)));
    } else {
      setCartItems((items) => items.map((it) => (size ? (it.uid === uidKey ? { ...it, quantity: newQty } : it) : (it.id === prodId ? { ...it, quantity: newQty } : it))));
    }

    markUpdating(productIdOrUid);
    if (pendingUpdatesRef.current[productIdOrUid] && pendingUpdatesRef.current[productIdOrUid].timer) clearTimeout(pendingUpdatesRef.current[productIdOrUid].timer);

    const timer = setTimeout(async () => {
      try {
        if (newQty <= 0) {
          // remove
          await fetch(`${baseURL}/api/reservations`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: prodId, size }) }).catch(() => {});
          const delRes = await fetch(`${baseURL}/api/cart/items/${prodId}${size ? `?size=${encodeURIComponent(size)}` : ''}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          if (!delRes.ok) { const err = await delRes.json().catch(() => ({})); setCartItems(prevItems); alert(err.message || 'No se pudo eliminar el producto.'); }
          else { const body = await delRes.json().catch(() => null); if (Array.isArray(body)) setCartItems(mapServerCart(body)); else await loadCart(); }
        } else {
          // release old
          await fetch(`${baseURL}/api/reservations`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: prodId, size }) }).catch(() => {});
          // reserve new qty
          const reserveRes = await fetch(`${baseURL}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: prodId, size, quantity: newQty }) });
          if (!reserveRes.ok) { const err = await reserveRes.json().catch(() => ({})); setCartItems(prevItems); alert(err.message || 'No se pudo reservar la nueva cantidad.'); }
          else {
            // persist change in cart (delete + add)
            await fetch(`${baseURL}/api/cart/items/${prodId}${size ? `?size=${encodeURIComponent(size)}` : ''}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            const addRes = await fetch(`${baseURL}/api/cart/items`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: prodId, quantity: newQty, size }) });
            if (addRes.ok) { const cartData = await addRes.json().catch(() => null); if (Array.isArray(cartData)) setCartItems(mapServerCart(cartData)); else await loadCart(); }
            else { const err = await addRes.json().catch(() => ({})); console.error('Error updating cart qty', err); setCartItems(prevItems); alert(err.message || 'No se pudo actualizar la cantidad.'); }
          }
        }
      } catch (err) {
        console.error('updateCartItemQuantity error', err);
        setCartItems(prevItems);
        alert('Error de conexión.');
      } finally {
        delete pendingUpdatesRef.current[productIdOrUid];
        unmarkUpdating(productIdOrUid);
      }
    }, 2000);

    pendingUpdatesRef.current[productIdOrUid] = { timer, qty: newQty };
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) { setCartItems([]); return; }
    const prev = cartItems;
    setCartItems([]);
    try {
      // release all reservations for user
      await fetch(`${baseURL}/api/reservations`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({}) }).catch(() => {});
      const res = await fetch(`${baseURL}/api/cart`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json().catch(() => null); if (Array.isArray(data)) setCartItems(mapServerCart(data)); else await loadCart(); }
      else { const err = await res.json().catch(() => ({})); console.error('clearCart server error', err); setCartItems(prev); alert(err.message || 'No se pudo vaciar el carrito.'); }
    } catch (err) { console.error('clearCart error', err); setCartItems(prev); alert('Error de conexión.'); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadCart(); }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, isCartOpen, openCart, closeCart, toggleCart, removeFromCart, updateCartItemQuantity, isUpdating, getCartTotal, loading, refetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
// also provide a named export for files that import { CartProvider }
export { CartProvider };
// import React, { useState, useEffect, useRef } from 'react';
