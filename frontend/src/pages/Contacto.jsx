// src/pages/Contacto.jsx
import React, { useState } from "react";
import "../style/contacto.css";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    email: "",
    motivo: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("¡Mensaje enviado! Te contactaremos pronto.");
    // Limpiar formulario
    setFormData({
      nombre: "",
      telefono: "",
      asunto: "",
      mensaje: "",
      email: "",
      motivo: ""
    });
  };

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <section className="contacto-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Contáctanos</h1>
            <p className="hero-subtitle">
              ¿Tienes preguntas sobre nuestros productos orgánicos? Estamos aquí para ayudarte. 
              Ponte en contacto con nuestro equipo de expertos en moda sostenible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contacto-main">
        <div className="container">
          <div className="contacto-grid">
            {/* Formulario de Contacto */}
            <div className="form-section">
              <div className="form-header">
                <div className="form-title-wrapper">
                  <h2>Envíanos un Mensaje</h2>
                  <div className="form-decoration">
                    <div className="decoration-dot"></div>
                    <div className="decoration-line"></div>
                    <div className="decoration-dot"></div>
                  </div>
                </div>
                <p className="form-description">
                  Completa el formulario y te responderemos en menos de 24 horas. 
                  Todos los campos marcados con <span className="required">*</span> son obligatorios.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">
                      Nombre Completo <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre completo"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu.email@ejemplo.com"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+1 (351) 123-4567"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="motivo">Tipo de Consulta</label>
                    <select
                      id="motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Selecciona un motivo</option>
                      <option value="productos">Información de productos</option>
                      <option value="envios">Consultas sobre envíos</option>
                      <option value="devoluciones">Devoluciones y cambios</option>
                      <option value="sostenibilidad">Sostenibilidad y materiales</option>
                      <option value="general">Consulta general</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">
                    Asunto <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="Breve descripción de tu consulta"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">
                    Mensaje <span className="required">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Describe detalladamente tu consulta, pregunta o sugerencia..."
                    rows="6"
                    required
                    className="form-textarea"
                  ></textarea>
                  <div className="textarea-counter">
                    {formData.mensaje.length}/500 caracteres
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                  <span className="btn-icon">✉️</span>
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Información de Contacto */}
            <div className="info-section">
              {/* Soporte Rápido */}
              <div className="info-card soporte-rapido">
                <div className="card-header">
                  <div className="card-icon">🚀</div>
                  <h3>Soporte Rápido</h3>
                </div>
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon-wrapper">
                      <div className="method-icon">👨‍💼</div>
                    </div>
                    <div className="method-info">
                      <strong>Usman Alvora</strong>
                      <span>Especialista en Productos</span>
                      <div className="method-contact">+1 (353) 123-4567</div>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="method-icon-wrapper">
                      <div className="method-icon">📧</div>
                    </div>
                    <div className="method-info">
                      <strong>Email Directo</strong>
                      <span>Respuesta en 2 horas</span>
                      <div className="method-contact">soporte@ecovestir.com</div>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="method-icon-wrapper">
                      <div className="method-icon">💬</div>
                    </div>
                    <div className="method-info">
                      <strong>Chat en Vivo</strong>
                      <span>Asistencia inmediata</span>
                      <div className="method-contact">9:00 AM - 6:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nuestra Oficina */}
              <div className="info-card oficina">
                <div className="card-header">
                  <div className="card-icon">🏢</div>
                  <h3>Nuestra Oficina</h3>
                </div>
                <div className="office-info">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                      <strong>Dirección Principal</strong>
                      <p>Av. Sostenibilidad 123, Piso 4<br />Ciudad Verde, CP 12545<br />País</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div className="info-text">
                      <strong>Teléfono Central</strong>
                      <p>+1 (351) 123-4567</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">✉️</div>
                    <div className="info-text">
                      <strong>Email Corporativo</strong>
                      <p>info@ecovestir.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios de Atención */}
              <div className="info-card horarios">
                <div className="card-header">
                  <div className="card-icon">🕒</div>
                  <h3>Horarios de Atención</h3>
                </div>
                <div className="schedule">
                  <div className="schedule-item">
                    <div className="schedule-days">
                      <span>Lunes - Viernes</span>
                    </div>
                    <div className="schedule-hours">
                      <span>9:00 - 18:00</span>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-days">
                      <span>Sábados</span>
                    </div>
                    <div className="schedule-hours">
                      <span>10:00 - 14:00</span>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <div className="schedule-days">
                      <span>Domingos</span>
                    </div>
                    <div className="schedule-hours closed">
                      <span>Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header center">
            <h2>Preguntas Frecuentes</h2>
            <p className="section-subtitle">
              Respuestas rápidas a las consultas más comunes sobre nuestros productos y servicios
            </p>
            <div className="accent-line center"></div>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-icon">🌿</div>
              <h3>¿Qué hace que la ropa sea orgánica?</h3>
              <p>
                Nuestra ropa orgánica está fabricada con materiales cultivados sin pesticidas, 
                fertilizantes sintéticos o modificaciones genéticas, certificados bajo estándares 
                internacionales como GOTS y OEKO-TEX.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-icon">🔄</div>
              <h3>¿Cuál es su política de devoluciones?</h3>
              <p>
                Aceptamos devoluciones dentro de 30 días desde la compra. Los artículos deben 
                estar en condición original con etiquetas. Proceso 100% sostenible y sin complicaciones.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-icon">🚚</div>
              <h3>¿Ofrecen envío gratuito?</h3>
              <p>
                Sí, ofrecemos envío gratuito en pedidos superiores a $75. Para pedidos menores, 
                el costo de envío es de $5.99. Entregamos en todo el país en 3-5 días hábiles.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-icon">🧼</div>
              <h3>¿Cómo cuido mi ropa orgánica?</h3>
              <p>
                Recomendamos lavar en agua fría, usar detergentes naturales y secar al aire libre 
                para mantener la calidad y durabilidad de las fibras orgánicas. Consulta nuestra guía de cuidados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ayuda Inmediata - AL FINAL */}
      <section className="ayuda-inmediata">
        <div className="container">
          <div className="ayuda-content">
            <div className="ayuda-text">
              <h2>¿Necesitas Ayuda Inmediata?</h2>
              <p>
                Nuestro equipo de atención al cliente está disponible para resolver todas tus dudas 
                sobre productos orgánicos, envíos, devoluciones y sostenibilidad.
              </p>
            </div>
            <div className="ayuda-buttons">
              <button className="btn btn-call">
                <span className="btn-icon">📞</span>
                Llamar Ahora
              </button>
              <button className="btn btn-chat">
                <span className="btn-icon">💬</span>
                Chat en Vivo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}