// src/pages/Home.jsx

import React from 'react';
import Hero from '../components/Hero';
import Productos from '../components/Productos';
import '../style/home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <Productos />

      {/* Sección 2: Nuestras Categorías */}
      <section className="categorias-section">
        <div className="categorias-container">
          <h2 className="categorias-title">Nuestras Categorías</h2>
          <p className="categorias-subtitle">
            Explora nuestra amplia gama de categorías de ropa orgánica. Desde casual hasta formal, tenemos todo lo que necesitas.
          </p>

          <div className="categorias-grid">
            {[
              {
                name: 'Camisetas',
                description: 'Cómodas y transpirables',
                products: 45,
                image: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                link: '/productos?categoria=camisetas'
              },
              {
                name: 'Vestidos',
                description: 'Elegancia sostenible',
                products: 32,
                image: 'https://images.unsplash.com/photo-1643185720431-9c050eebbc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhbWJvbyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzU1MDMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                link: '/productos?categoria=vestidos'
              },
              {
                name: 'Pantalones',
                description: 'Comodidad natural',
                products: 28,
                image: 'https://images.unsplash.com/photo-1543121032-68865adeff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGhlbXAlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTc1NTAzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                link: '/productos?categoria=pantalones'
              },
              {
                name: 'Camisas',
                description: 'Estilo profesional',
                products: 21,
                image: 'https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbGluZW4lMjBzaGlydCUyMG5hdHVyYWwlMjBmYWJyaWN8ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                link: '/productos?categoria=camisas'
              }
            ].map((cat, index) => (
              <div key={index} className="categoria-card">
                <img src={cat.image} alt={cat.name} className="categoria-image" />
                <div className="categoria-content">
                  <h3 className="categoria-name">{cat.name}</h3>
                  <p className="categoria-description">{cat.description}</p>
                  <p className="categoria-products">{cat.products} productos</p>
                  <a href={cat.link} className="categoria-btn">
                    Ver Categoría →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 3: ¿Por Qué Elegir Ropa Orgánica? */}
      <section className="porque-organica-section">
        <div className="porque-organica-container">
          <h2 className="porque-organica-title">¿Por Qué Elegir Ropa Orgánica?</h2>

          <div className="porque-organica-grid">
            {[
              {
                icon: '🌱',
                title: 'Mejor para tu Piel',
                description: 'Los materiales orgánicos son más suaves y no contienen químicos que puedan irritar tu piel sensible.'
              },
              {
                icon: '🌍',
                title: 'Amigable con el Medio Ambiente',
                description: 'La producción orgánica utiliza menos agua y no contamina el suelo con pesticidas nocivos.'
              },
              {
                icon: '🤝',
                title: 'Comercio Justo',
                description: 'Apoyamos a los agricultores y trabajadores con condiciones laborales justas y salarios dignos.'
              }
            ].map((item, index) => (
              <div key={index} className="porque-item">
                <div className="porque-icon">{item.icon}</div>
                <h3 className="porque-title">{item.title}</h3>
                <p className="porque-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}