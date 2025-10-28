// src/pages/Home.jsx

import React from 'react';
import Hero from '../components/Hero';
import Productos from '../components/Productos';
import Categories from '../components/Categories';
import { Leaf, Globe, Handshake } from 'lucide-react';
import '../style/home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <Productos />
      <Categories />

      {/* Sección 3: ¿Por Qué Elegir Ropa Orgánica? */}
      <section className="porque-organica-section">
        <div className="porque-organica-container">
          <h2 className="porque-organica-title">¿Por Qué Elegir Ropa Orgánica?</h2>

          <div className="porque-organica-grid">
            {[
              {
                icon: <Leaf size={48} strokeWidth={1.5} />,
                title: 'Mejor para tu Piel',
                description: 'Los materiales orgánicos son más suaves y no contienen químicos que puedan irritar tu piel sensible.'
              },
              {
                icon: <Globe size={48} strokeWidth={1.5} />,
                title: 'Amigable con el Medio Ambiente',
                description: 'La producción orgánica utiliza menos agua y no contamina el suelo con pesticidas nocivos.'
              },
              {
                icon: <Handshake size={48} strokeWidth={1.5} />,
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