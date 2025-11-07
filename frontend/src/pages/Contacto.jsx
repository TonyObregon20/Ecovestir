// src/pages/Contacto.jsx
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import "../style/contacto.css";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    reason: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        reason: ""
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Nuestra Oficina',
      details: [
        'Av. Sostenibilidad 123, Piso 4',
        'Ciudad Verde, País',
        'CP: 12345'
      ]
    },
    {
      icon: Phone,
      title: 'Teléfono',
      details: [
        '+1 (555) 123-4567',
        'Lun - Vie: 9:00 AM - 6:00 PM',
        'Sáb: 10:00 AM - 2:00 PM'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'hola@ecovestir.com',
        'soporte@ecovestir.com',
        'ventas@ecovestir.com'
      ]
    },
    {
      icon: Clock,
      title: 'Horarios de Atención',
      details: [
        'Lunes - Viernes: 9:00 - 18:00',
        'Sábados: 10:00 - 14:00',
        'Domingos: Cerrado'
      ]
    }
  ];

  const faqItems = [
    {
      question: '¿Qué hace que la ropa sea orgánica?',
      answer: 'Nuestra ropa orgánica está fabricada con materiales cultivados sin pesticidas, fertilizantes sintéticos o químicos nocivos, certificados bajo estándares internacionales como GOTS.'
    },
    {
      question: '¿Ofrecen envío gratuito?',
      answer: 'Sí, ofrecemos envío gratuito en pedidos superiores a $75. Para pedidos menores, el costo de envío es de $8.99.'
    },
    {
      question: '¿Cuál es su política de devoluciones?',
      answer: 'Aceptamos devoluciones dentro de 30 días desde la compra. Los artículos deben estar en condición original con etiquetas.'
    },
    {
      question: '¿Cómo cuido mi ropa orgánica?',
      answer: 'Recomendamos lavar en agua fría, usar detergentes naturales y secar al aire libre para mantener la calidad y durabilidad de las fibras orgánicas.'
    }
  ];

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <div className="contacto-hero"> 
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Contáctanos</h1>
            <p className="hero-subtitle">
              ¿Tienes preguntas sobre nuestros productos orgánicos? Estamos aquí para <br />
              ayudarte. Ponte en contacto con nuestro equipo.
            </p>
          </div>
        </div>
      </div>

      <div className="contacto-main">
        <div className="container">
          <div className="contacto-grid">
            {/* Contact Form */}
            <div className="form-column">
              <div className="contact-card">
                <div className="card-header-contact">
                  <MessageCircle className="header-icon" size={20} />
                  <h2 className="card-title-contact">Envíanos un Mensaje</h2>
                </div>
                <div className="card-content">
                  {isSubmitted ? (
                    <div className="success-message">
                      <CheckCircle className="success-icon" size={64} />
                      <h3 className="success-title">¡Mensaje Enviado!</h3>
                      <p className="success-text">
                        Gracias por contactarnos. Nos comunicaremos contigo en las próximas 24 horas.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Nombre Completo *</label>
                          <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Tu nombre"
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">Email *</label>
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="tu@email.com"
                            required
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="phone" className="form-label">Teléfono</label>
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(+51) 999999999"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="reason" className="form-label">Motivo de Contacto</label>
                          <select
                            id="reason"
                            value={formData.reason}
                            onChange={(e) => handleInputChange('reason', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Selecciona un motivo</option>
                            <option value="info-producto">Información de Producto</option>
                            <option value="pedido">Consulta sobre Pedido</option>
                            <option value="devolucion">Devolución/Cambio</option>
                            <option value="sostenibilidad">Sostenibilidad</option>
                            <option value="mayoreo">Ventas al Mayor</option>
                            <option value="prensa">Prensa/Media</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="subject" className="form-label">Asunto *</label>
                        <input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Asunto de tu mensaje"
                          required
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="message" className="form-label">Mensaje *</label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Escribe tu mensaje aquí..."
                          rows={5}
                          required
                          className="form-textarea"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn-submit-contact"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Enviando...'
                        ) : (
                          <>
                            <Send className="btn-icon-inline" size={16} />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="info-column">
              {/* Contact Details */}
              <div className="contact-info-grid">
                {contactInfo.map((info) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={info.title} className="info-card-small">
                      <div className="info-card-content">
                        <div className="info-icon-wrapper">
                          <div className="info-icon-bg">
                            <IconComponent className="info-icon-svg" size={20} />
                          </div>
                        </div>
                        <div className="info-details">
                          <h3 className="info-title">{info.title}</h3>
                          <div className="info-list">
                            {info.details.map((detail, index) => (
                              <p key={index} className="info-detail-text">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map placeholder */}
              <div className="map-card">
                <div className="map-placeholder">
                  <MapPin className="map-icon" size={48} />
                  <p className="map-title">Mapa de Ubicación</p>
                  <p className="map-address">Av. Sostenibilidad 123</p>
                </div>
              </div>

              {/* Quick Support */}
              <div className="support-card">
                <div className="support-header">
                  <h3 className="support-title">Soporte Rápido</h3>
                </div>
                <div className="support-content">
                  <button className="support-btn">
                    <Phone className="support-icon" size={16} />
                    <span>Llamar Ahora: +1 (555) 123-4567</span>
                  </button>
                  <button className="support-btn">
                    <Mail className="support-icon" size={16} />
                    <span>Email: soporte@ecovestir.com</span>
                  </button>
                  <button className="support-btn">
                    <MessageCircle className="support-icon" size={16} />
                    <span>Chat en Vivo (9AM - 6PM)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
          <h2 className="faq-main-title">Preguntas Frecuentes</h2>
          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-card">
                <h3 className="faq-question">{item.question}</h3>
                <p className="faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="help-banner">
        <h2>¿Necesitas Ayuda Inmediata?</h2>
        <p>
          Nuestro equipo de atención al cliente está disponible para resolver todas tus dudas sobre productos orgánicos, envíos y devoluciones.
        </p>
        <div className="button-group">
          <a href="tel:+51999888777" className="btn btn-call">
            <Phone className="icon" size={20} /> Llamar Ahora
          </a>
          <a href="#chat" className="btn btn-chat">
            <MessageCircle className="icon" size={20} /> Chat en Vivo
          </a>
        </div>
      </div>
    </div>
  );
}