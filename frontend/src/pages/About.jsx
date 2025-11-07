import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Heart, Users, Award, Factory, Recycle } from 'lucide-react';
import '../style/about.css'; // Estilos en CSS puro

export default function AboutPage() {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: 'Ricardo Huaman',
      role: 'Fundador & CEO',
      bio: 'Apasionada por la moda sostenible con 15 años de experiencia en la industria textil.',
      image: 'https://images.unsplash.com/photo-1676474509670-f1978e55fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjB0ZWFtJTIwb2ZmaWNlJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU4NTAxMzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Anthony Obregon',
      role: 'CoFundador & CEO',
      bio: 'Diseñador textil especializado en materiales orgánicos y producción ética.',
      image: 'https://images.unsplash.com/photo-1676474509670-f1978e55fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjB0ZWFtJTIwb2ZmaWNlJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU4NTAxMzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Andrea Peña',
      role: 'Directora de Sostenibilidad',
      bio: 'Experta en certificaciones orgánicas y cadena de suministro responsable.',
      image: 'https://images.unsplash.com/photo-1676474509670-f1978e55fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjB0ZWFtJTIwb2ZmaWNlJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU4NTAxMzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  // const milestones = [
  //   { year: '2018', event: 'Fundación de EcoVestir' },
  //   { year: '2019', event: 'Primera colección 100% orgánica' },
  //   { year: '2020', event: 'Certificación GOTS obtenida' },
  //   { year: '2021', event: '10,000 clientes satisfechos' },
  //   { year: '2022', event: 'Expansión internacional' },
  //   { year: '2023', event: 'Premio Moda Sostenible del Año' },
  //   { year: '2024', event: 'Lanzamiento tienda online' }
  // ];

  const certifications = [
    { name: 'GOTS', description: 'Global Organic Textile Standard' },
    { name: 'OEKO-TEX', description: 'Standard 100 Certificación' },
    { name: 'Fair Trade', description: 'Comercio Justo Certificado' },
    { name: 'B-Corp', description: 'Empresa B Certificada' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sobre EcoVestir</h1>
          <p>Pioneros en moda sostenible desde 2018, creando ropa orgánica que cuida tu piel y protege nuestro planeta.</p>
          <div className="badges">
            <span className="badge">6+ Años de Experiencia</span>
            <span className="badge">50,000+ Clientes Felices</span>
            <span className="badge">100% Orgánico</span>
          </div>
        </div>
      </section>

      {/* Misión Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Nuestra Misión</h2>
          <p>En EcoVestir, creemos que la moda debe ser hermosa, cómoda y responsable. Nuestra misión es democratizar el acceso a ropa orgánica de alta calidad, demostrando que es posible vestirse bien mientras cuidamos nuestro planeta y apoyamos a las comunidades productoras.</p>
          
          <div className="mission-cards">
            <div className="mission-card">
              <div className="icon-circle">
                <Leaf size={30} />
              </div>
              <h3>Sostenibilidad</h3>
              <p>Materiales 100% orgánicos y procesos de producción que respetan el medio ambiente.</p>
            </div>
            
            <div className="mission-card">
              <div className="icon-circle">
                <Heart size={30} />
              </div>
              <h3>Bienestar</h3>
              <p>Ropa que cuida tu piel y tu salud, libre de químicos nocivos y alérgenos.</p>
            </div>
            
            <div className="mission-card">
              <div className="icon-circle">
                <Users size={30} />
              </div>
              <h3>Comunidad</h3>
              <p>Apoyo a agricultores y trabajadores textiles con condiciones justas y dignas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section className="history-section">
        <div className="container">
          <h2>Nuestra Historia</h2>
          <div className="history-content">
            <div className="history-text">
              <p>EcoVestir nació en 2018 cuando nuestra fundadora, María González, se dio cuenta de los efectos nocivos de la moda rápida en su propia piel y en el medio ambiente. Después de desarrollar alergias por el uso de ropa con químicos sintéticos, decidió crear una alternativa.</p>
              <p>Comenzamos con una pequeña colección de camisetas de algodón orgánico, trabajando directamente con agricultores certificados. La respuesta fue inmediata: nuestros clientes no solo notaron la diferencia en calidad y comodidad, sino que también se sintieron bien sabiendo que su compra tenía un impacto positivo.</p>
              <p>Hoy, somos una marca reconocida internacionalmente con certificaciones de sostenibilidad, pero mantenemos nuestros valores fundamentales: calidad, transparencia y respeto por las personas y el planeta.</p>
            </div>
            <div className="history-image">
              <img src="https://images.unsplash.com/photo-1706535426949-e90f953f0d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwZmFjdG9yeSUyMHN1c3RhaW5hYmxlJTIwcHJvZHVjdGlvbnxlbnwxfHx8fDE3NTg1MDEzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Algodón orgánico" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="timeline-section">
        <div className="container">
          <h2>Nuestro Camino</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-event">{milestone.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Equipo Section */}
      <section className="team-section">
        <div className="container">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores y Certificaciones */}
      <section className="values-section">
        <div className="container">
          <h2>Nuestros Valores y Certificaciones</h2>
          <div className="values-container">
            <div className="values-column">
              <h3>Lo Que Nos Define</h3>
              <div className="value-item">
                <Factory size={24} />
                <div>
                  <h4>Transparencia Total</h4>
                  <p>Conoce exactamente de dónde viene cada prenda y cómo se fabrica.</p>
                </div>
              </div>
              <div className="value-item">
                <Recycle size={24} />
                <div>
                  <h4>Economía Circular</h4>
                  <p>Diseños duraderos y programas de reciclaje para extender la vida útil.</p>
                </div>
              </div>
              <div className="value-item">
                <Award size={24} />
                <div>
                  <h4>Calidad Premium</h4>
                  <p>Materiales de la más alta calidad con acabados artesanales.</p>
                </div>
              </div>
            </div>
            
            <div className="certifications-column">
              <h3>Certificaciones</h3>
              <div className="certifications-grid">
                {certifications.map((cert) => (
                  <div key={cert.name} className="cert-card">
                    <div className="cert-icon">
                      <Award size={24} />
                    </div>
                    <h4>{cert.name}</h4>
                    <p>{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Únete a Nuestra Comunidad</h2>
          <p>Sé parte del movimiento hacia una moda más consciente y sostenible. Juntos podemos crear un futuro mejor para nuestro planeta.</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/productos')}>Explorar Colección</button>
            <button className="btn-secondary" onClick={() => navigate('/contacto')}>Contactar</button>
          </div>
        </div>
      </section>
    </div>
  );
}