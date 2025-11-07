// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/useCart';
import '../style/checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados del formulario de envío
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    saveInfo: false
  });

  // Estado del método de envío seleccionado
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCosts = {
    standard: 0,
    express: 15,
    overnight: 30
  };
  const shippingCost = shippingCosts[shippingMethod];
  const tax = subtotal * 0.16; // IVA 16%
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // clear field-specific error while user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();

    // Validación básica y construcción de errores por campo
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!shippingData[field] || shippingData[field].toString().trim() === '') {
        newErrors[field] = 'Campo requerido';
      }
    });

    // Si hay campos vacíos, setear errores y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validaciones específicas
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^9\d{8}$/; // 9 digits starting with 9
    const zipRegex = /^\d{5}$/; // exactly 5 digits
  const addressRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.-]+$/; // letters, numbers, spaces, commas, dots, hyphen

    if (!nameRegex.test(shippingData.firstName.trim())) newErrors.firstName = 'Sólo letras y espacios';
    if (!nameRegex.test(shippingData.lastName.trim())) newErrors.lastName = 'Sólo letras y espacios';
    if (!nameRegex.test(shippingData.city.trim())) newErrors.city = 'Ciudad invalida';
    if (!nameRegex.test(shippingData.state.trim())) newErrors.state = 'Distrito invalido';

    if (!emailRegex.test(shippingData.email.trim())) newErrors.email = 'Email inválido';

    const phoneDigits = shippingData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(phoneDigits)) newErrors.phone = 'Teléfono inválido';

  if (!zipRegex.test(shippingData.zipCode.trim())) newErrors.zipCode = 'Código postal inválido';

  if (!addressRegex.test(shippingData.address.trim())) newErrors.address = 'Escribe una dirección válida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Aquí podrías enviar paymentInfo real a tu pasarela, por ahora simulamos y enviamos los datos al backend
      const token = localStorage.getItem('token');
      const paymentInfo = { shippingData, shippingMethod, total };

      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentInfo }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al crear la orden');
      }

      const data = await res.json();
      // Orden creada correctamente en backend
      setLoading(false);
      setCurrentStep(3);
      // Limpiar carrito local y reservas
  try { await clearCart(); } catch { /* ignore */ }

      // Redirigir a página de detalle de orden o a productos después de mostrar confirmación
      setTimeout(() => {
        if (data && data.order && data.order._id) navigate(`/order/${data.order._id}`);
        else navigate('/productos');
      }, 2000);
    } catch (err) {
      console.error('Error placing order:', err);
      setLoading(false);
      alert(err.message || 'Error procesando el pago');
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-to-shop" onClick={() => navigate('/productos')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la tienda
          </button>
          <h1>Finalizar Compra</h1>
          <p className="checkout-subtitle">Completa tu pedido de forma segura y rápida</p>
        </div>

        {/* Steps Indicator */}
        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Envío</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Pago</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmación</div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Left Side - Forms */}
          <div className="checkout-left">
            {/* Step 1: Información de Envío */}
            {currentStep === 1 && (
              <form className="shipping-form" onSubmit={handleContinueToPayment}>
                <div className="form-section">
                  <div className="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2>Información de Envío</h2>
                  </div>
                  <p className="section-description">Ingresa la dirección donde deseas recibir tu pedido</p>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="firstName">Nombre *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleInputChange}
                        placeholder="Juan"
                        required
                      />
                        {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="lastName">Apellido *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleInputChange}
                        placeholder="Pérez"
                        required
                      />
                      {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                      {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">Teléfono *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        placeholder="5512345678"
                        maxLength={9}
                        inputMode="numeric"
                        required
                      />
                      {errors.phone && <div className="field-error">{errors.phone}</div>}
                    </div>

                    <div className="form-field full-width">
                      <label htmlFor="address">Dirección *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleInputChange}
                        placeholder="Calle Ejemplo 123, Col. Centro"
                        required
                      />
                      {errors.address && <div className="field-error">{errors.address}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="city">Ciudad *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        placeholder="Lima"
                        required
                      />
                      {errors.city && <div className="field-error">{errors.city}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="state">Distrito *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={handleInputChange}
                        placeholder="Surco"
                        required
                      />
                      {errors.state && <div className="field-error">{errors.state}</div>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="zipCode">Código Postal *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        placeholder="01000"
                        maxLength={5}
                        inputMode="numeric"
                        required
                      />
                      {errors.zipCode && <div className="field-error">{errors.zipCode}</div>}
                    </div>
                  </div>

                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={shippingData.saveInfo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="saveInfo">
                      Guardar esta información para futuras compras
                    </label>
                  </div>
                </div>

                {/* Método de Envío */}
                <div className="form-section">
                  <div className="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h2>Método de Envío</h2>
                  </div>
                  <p className="section-description">Elige cómo deseas recibir tu pedido</p>

                  <div className="shipping-methods">
                    <label className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="option-content">
                        <div className="option-header">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          <div>
                            <h3>Envío Estándar</h3>
                            <p>5-7 días hábiles</p>
                          </div>
                        </div>
                        <div className="option-price">Gratis</div>
                      </div>
                    </label>

                    <label className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="option-content">
                        <div className="option-header">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div>
                            <h3>Envío Express</h3>
                            <p>2-3 días hábiles</p>
                          </div>
                        </div>
                        <div className="option-price">$15</div>
                      </div>
                    </label>

                    <label className={`shipping-option ${shippingMethod === 'overnight' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="overnight"
                        checked={shippingMethod === 'overnight'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="option-content">
                        <div className="option-header">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <h3>Envío Nocturno</h3>
                            <p>1 día hábil</p>
                          </div>
                        </div>
                        <div className="option-price">$30</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" className="continue-btn">
                  Continuar al Pago
                </button>
              </form>
            )}

            {/* Step 2: Pago */}
            {currentStep === 2 && (
              <div className="payment-section">
                <button className="edit-btn" onClick={() => setCurrentStep(1)}>
                  ← Editar información de envío
                </button>
                
                <div className="form-section">
                  <div className="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h2>Método de Pago</h2>
                  </div>
                  
                  <div className="payment-demo">
                    <p>El pago se procesará automáticamente</p>
                    <p className="demo-note">Proximamente, integración de una pasarela de pago</p>
                  </div>

                  <button 
                    className="place-order-btn" 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {currentStep === 3 && (
              <div className="confirmation-section">
                <div className="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2>¡Pedido Confirmado!</h2>
                <p>Gracias por tu compra. Recibirás un email con los detalles de tu pedido.</p>
                <button className="continue-shopping-btn" onClick={() => navigate('/productos')}>
                  Continuar Comprando
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="checkout-right">
            <div className="order-summary">
              <div className="summary-header">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2>Resumen del Pedido</h2>
              </div>

              {/* Productos */}
              <div className="cart-items">
                {cartItems.map((item, idx) => (
                  <div key={item.uid ?? item.id ?? `${item.name || 'item'}-${idx}`} className="cart-item">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      {item.size && <p className="item-size">Talla {item.size}</p>}
                      <p className="item-quantity">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="total-row">
                  <span>IVA (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Eco Message */}
              <div className="eco-message">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Tu compra ayuda al planeta. Usamos empaques 100% reciclables.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
