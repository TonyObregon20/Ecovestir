// src/components/Footer.jsx
import React from 'react';
// import { useAuth } from '../hooks/useAuth';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../style/footer.css'; 

const Footer = () => {
  // const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1: Brand */}
        <div className="footer-column">
          <div className="footer-logo">
            <Leaf className="footer-logo-icon" size={32} />
            <span className="footer-logo-text">EcoVestir</span>
          </div>
          <p className="footer-description">
            Comprometidos con la moda sostenible y responsable. 
            Cada prenda que creamos respeta el medio ambiente y a las personas.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaFacebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaInstagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Columna 2: Quick Links */}
        <div className="footer-column">
          <h3 className="footer-heading">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><a href="/" className="footer-link">Inicio</a></li>
            <li><a href="/productos" className="footer-link">Productos</a></li>
            <li><a href="/sobre-nosotros" className="footer-link">Sobre Nosotros</a></li>
            <li><a href="/blog" className="footer-link">Blog</a></li>
            <li><a href="/contacto" className="footer-link">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 3: Customer Service */}
        <div className="footer-column">
          <h3 className="footer-heading">Atención al Cliente</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Centro de Ayuda</a></li>
            <li><a href="#" className="footer-link">Guía de Tallas</a></li>
            <li><a href="#" className="footer-link">Envíos y Devoluciones</a></li>
            <li><a href="#" className="footer-link">Términos y Condiciones</a></li>
            <li><a href="#" className="footer-link">Política de Privacidad</a></li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div className="footer-column">
          <h3 className="footer-heading">Newsletter</h3>
          <p className="footer-newsletter-description">
            Suscríbete para recibir noticias sobre nuevos productos y ofertas especiales.
          </p>
          <div className="footer-newsletter">
            <input
              type="email"
              placeholder="Tu email"
              className="footer-newsletter-input"
            />
            <button className="footer-newsletter-button">Suscribirse</button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="footer-contact-section">
        <div className="footer-contact-row">
          <div className="footer-contact-item">
            <Mail className="footer-contact-icon" size={16} />
            <span>contacto@ecovestir.com</span>
          </div>
          <div className="footer-contact-item">
            <Phone className="footer-contact-icon" size={16} />
            <span>+51 900 123 456</span>
          </div>
          <div className="footer-contact-item">
            <MapPin className="footer-contact-icon" size={16} />
            <span>Lima, Peru</span>
          </div>
        </div>
</div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>&copy; 2025 EcoVestir. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;