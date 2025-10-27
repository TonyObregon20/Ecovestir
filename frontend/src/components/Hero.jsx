import { useNavigate } from 'react-router-dom';
import '../style/hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-titles">
            <h1 className="hero-title-primary">
              Ropa Orgánica
            </h1>
            <h2 className="hero-title-secondary">
              Para un Futuro Sostenible
            </h2>
          </div>
          
          <p className="hero-description">
            Descubre nuestra colección de ropa fabricada con materiales 100% orgánicos. Cuida tu piel y el planeta con cada prenda que eliges.
          </p>

          <ul className="hero-features">
            <li className="hero-feature-item">
              <div className="hero-check-icon"></div>
              <span>Algodón orgánico certificado</span>
            </li>
            <li className="hero-feature-item">
              <div className="hero-check-icon"></div>
              <span>Libre de químicos tóxicos</span>
            </li>
            <li className="hero-feature-item">
              <div className="hero-check-icon"></div>
              <span>Comercio justo</span>
            </li>
          </ul>

          <div className="hero-buttons">
            <button className="hero-btn-primary" onClick={() => navigate('/productos')}>
              Explorar Colección
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/sobre-nosotros')}>
              Conoce Más
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1571773531692-414db6fc0328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwb3JnYW5pYyUyMGZhYnJpYyUyMHRleHR1cmV8ZW58MXx8fHwxNzU3NTUwMzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Textiles orgánicos naturales" 
              className="hero-image"
            />
            <div className="hero-image-overlay"></div>
          </div>
          <div className="hero-blur-accent-1"></div>
          <div className="hero-blur-accent-2"></div>
        </div>
      </div>
    </section>
  );
}
