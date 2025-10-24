// src/pages/About.jsx
import React from "react";
import "../style/about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section Corregido */}
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Sobre EcoVestir</h1>
              <p className="hero-subtitle">
                Pioneros en moda sostenible desde 2018, creando ropa orgánica que cuida tu piel y protege nuestro planeta.
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">6+</div>
                <div className="stat-label">Años de Experiencia</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Clientes Felices</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Orgánico</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión Section */}
      <section className="mission-section">
        <div className="container">
          <div className="section-header">
            <h2>Nuestra Misión</h2>
            <div className="accent-line"></div>
          </div>
          <div className="mission-content">
            <p className="mission-text">
              En EcoVestir, creemos que la moda debe ser hermosa, cómoda y responsable. 
              Nuestra misión es democratizar el acceso a ropa orgánica de alta calidad, 
              demostrando que es posible vestirse bien mientras cuidamos nuestro planeta 
              y apoyamos a las comunidades productoras.
            </p>
            
            <div className="mission-pillars">
              <div className="pillar-card">
                <div className="pillar-icon">🌱</div>
                <h3>Sostenibilidad</h3>
                <p>Materiales 100% orgánicos y procesos de producción que respetan el medio ambiente.</p>
              </div>
              
              <div className="pillar-card">
                <div className="pillar-icon">💚</div>
                <h3>Bienestar</h3>
                <p>Ropa que cuida tu piel y tu salud, libre de químicos nocivos y alérgenos.</p>
              </div>
              
              <div className="pillar-card">
                <div className="pillar-icon">🤝</div>
                <h3>Comunidad</h3>
                <p>Apoyo a agricultores y trabajadores textiles con condiciones justas y dignas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section className="history-section">
        <div className="container">
          <div className="history-grid">
            <div className="history-content">
              <div className="section-header">
                <h2>Nuestra Historia</h2>
                <div className="accent-line"></div>
              </div>
              <div className="history-text">
                <p>
                  EcoVestir nació en 2018 cuando nuestra fundadora, María González, se dio cuenta 
                  de los efectos nocivos de la moda rápida en su propia piel y en el medio ambiente. 
                  Después de desarrollar alergias por el uso de ropa con químicos sintéticos, decidió 
                  crear una alternativa.
                </p>
                <p>
                  Comenzamos con una pequeña colección de camisetas de algodón orgánico, trabajando 
                  directamente con agricultores certificados. La respuesta fue inmediata: nuestros 
                  clientes no solo notaron la diferencia en calidad y comodidad, sino que también 
                  se sintieron bien sabiendo que su compra tenía un impacto positivo.
                </p>
                <p>
                  Hoy, somos una marca reconocida internacionalmente con certificaciones de sostenibilidad, 
                  pero mantenemos nuestros valores fundamentales: calidad, transparencia y respeto por 
                  las personas y el planeta.
                </p>
              </div>
            </div>
            
            <div className="history-visual">
              <div className="timeline">
                <h3>Nuestro Camino</h3>
                <div className="timeline-items">
                  <div className="timeline-item">
                    <span className="timeline-year">2018</span>
                    <span className="timeline-text">Fundación de EcoVestir</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2019</span>
                    <span className="timeline-text">Primera colección 100% orgánica</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2020</span>
                    <span className="timeline-text">Certificación GOTS obtenida</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2021</span>
                    <span className="timeline-text">10.000 clientes satisfechos</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2022</span>
                    <span className="timeline-text">Expansión Internacional</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2023</span>
                    <span className="timeline-text">Premio Moda Sostenible del Año</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">2024</span>
                    <span className="timeline-text">Lanzamiento tienda online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header center">
            <h2>Nuestro Equipo</h2>
            <div className="accent-line center"></div>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">MG</div>
              </div>
              <div className="member-info">
                <h3>María González</h3>
                <p className="member-role">Fundadora & CEO</p>
                <p className="member-bio">
                  Apasionada por la moda sostenible con 15 años de experiencia en la industria textil.
                </p>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">CM</div>
              </div>
              <div className="member-info">
                <h3>Carlos Mendoza</h3>
                <p className="member-role">Director de Diseño</p>
                <p className="member-bio">
                  Diseñador textil especializado en materiales orgánicos y producción ética.
                </p>
              </div>
            </div>
            
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">AR</div>
              </div>
              <div className="member-info">
                <h3>Ana Rodríguez</h3>
                <p className="member-role">Directora de Sostenibilidad</p>
                <p className="member-bio">
                  Experta en certificaciones orgánicas y cadena de suministro responsable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores y Certificaciones */}
      <section className="values-certifications">
        <div className="container">
          <div className="values-grid">
            <div className="values-content">
              <div className="section-header">
                <h2>Nuestros Valores</h2>
                <div className="accent-line"></div>
              </div>
              
              <div className="values-list">
                <div className="value-item">
                  <div className="value-icon">🔍</div>
                  <div className="value-text">
                    <h3>Transparencia Total</h3>
                    <p>Conoce exactamente de dónde viene cada prenda y cómo es fabricada.</p>
                  </div>
                </div>
                
                <div className="value-item">
                  <div className="value-icon">🔄</div>
                  <div className="value-text">
                    <h3>Economía Circular</h3>
                    <p>Diseños duraderos y programas de reciclaje para extender la vida útil.</p>
                  </div>
                </div>
                
                <div className="value-item">
                  <div className="value-icon">⭐</div>
                  <div className="value-text">
                    <h3>Calidad Premium</h3>
                    <p>Materiales de la más alta calidad con acabados artesanales.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="certifications-content">
              <div className="section-header">
                <h2>Certificaciones</h2>
                <div className="accent-line"></div>
              </div>
              
              <div className="certifications-grid">
                <div className="certification-item">
                  <div className="cert-icon">🌿</div>
                  <div className="cert-text">
                    <h4>GOTS</h4>
                    <p>Global Organic Textile Standard</p>
                  </div>
                </div>
                
                <div className="certification-item">
                  <div className="cert-icon">🧪</div>
                  <div className="cert-text">
                    <h4>OEKO-TEX</h4>
                    <p>Standard 100 Certification</p>
                  </div>
                </div>
                
                <div className="certification-item">
                  <div className="cert-icon">⚖️</div>
                  <div className="cert-text">
                    <h4>Fair Trade</h4>
                    <p>Comercio Justo Certificado</p>
                  </div>
                </div>
                
                <div className="certification-item">
                  <div className="cert-icon">🏢</div>
                  <div className="cert-text">
                    <h4>B Corp</h4>
                    <p>Empresa Certificada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      
    </div>
  );
}