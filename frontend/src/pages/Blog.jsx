// src/pages/Blog.jsx
import React, { useState } from 'react';
import { Star, Send, MessageCircle } from 'lucide-react';
import './../style/blog.css'; // Asegúrate de que la ruta sea correcta

// Datos de ejemplo de reseñas
const initialBlogPosts = [
  {
    id: '1',
    author: 'María García',
    title: 'La mejor compra que he hecho',
    content: 'Compré varias camisetas de algodón orgánico y la calidad es excepcional. Son súper suaves y me encanta saber que son sostenibles. El proceso de compra fue muy fácil y el envío llegó antes de lo esperado. ¡Definitivamente volveré a comprar!',
    rating: 5,
    date: '28 Oct 2025',
    productName: 'Camiseta de Algodón Orgánico Premium',
    productImage: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZSUyMGZhc2hpb258ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: '2',
    author: 'Carlos Rodríguez',
    title: 'Excelente calidad y servicio',
    content: 'Me impresionó la atención al cliente. Tenía algunas dudas sobre las tallas y me respondieron muy rápido. El vestido de bambú que compré para mi esposa le quedó perfecto y es hermoso. La tela es increíblemente suave.',
    rating: 5,
    date: '25 Oct 2025',
    productName: 'Vestido de Bambú Sostenible',
    productImage: 'https://images.unsplash.com/photo-1643185720431-9c050eebbc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhbWJvbyUyMGNsb3RoaW5nfGVufDF8fHx8MTc1NzU1MDMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: '3',
    author: 'Ana Martínez',
    title: 'Ropa cómoda y consciente',
    content: 'Llevo años buscando ropa sostenible de calidad y finalmente encontré EcoVestir. Los pantalones de cáñamo son perfectos para el día a día. Son cómodos, duraderos y el color se mantiene después de varios lavados.',
    rating: 4,
    date: '22 Oct 2025',
    productName: 'Pantalón de Cáñamo Ecológico',
    productImage: 'https://images.unsplash.com/photo-1543121032-68865adeff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGhlbXAlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTc1NTAzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: '4',
    author: 'Jorge López',
    title: 'Satisfecho con mi compra',
    content: 'La camisa de lino es justo lo que necesitaba para el verano. Es fresca, elegante y puedo usarla tanto en la oficina como en eventos casuales. El empaque también era ecológico, un detalle que aprecio mucho.',
    rating: 5,
    date: '18 Oct 2025',
    productName: 'Camisa de Lino Natural Respirable',
    productImage: 'https://images.unsplash.com/photo-1643286131725-5e0ad3b3ca02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbGluZW4lMjBzaGlydCUyMG5hdHVyYWwlMjBmYWJyaWN8ZW58MXx8fHwxNzU3NTUwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: '5',
    author: 'Laura Sánchez',
    title: 'Muy recomendable',
    content: 'Esta es mi tercera compra en EcoVestir y no me decepciona. La calidad es consistente y me encanta que cada vez agregan nuevos productos. Los materiales realmente hacen la diferencia en comodidad.',
    rating: 5,
    date: '15 Oct 2025',
    verified: true,
  },
  {
    id: '6',
    author: 'Pedro Hernández',
    title: 'Buena experiencia en general',
    content: 'Los productos son buenos, aunque esperaba que el envío fuera un poco más rápido. Sin embargo, la calidad de la ropa compensa totalmente. Son prendas que sé que me durarán años.',
    rating: 4,
    date: '10 Oct 2025',
    verified: false,
  },
];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    title: '',
    content: '',
    rating: 5,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.author || !formData.email || !formData.title || !formData.content) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newPost = {
      id: String(Date.now()),
      author: formData.author,
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      verified: false,
    };

    setBlogPosts([newPost, ...blogPosts]);

    // Reset form
    setFormData({
      author: '',
      email: '',
      title: '',
      content: '',
      rating: 5,
    });

    alert('¡Gracias por compartir tu experiencia! Tu reseña ha sido publicada exitosamente.');

    // Scroll to top to see the new post
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateAverageRating = () => {
    const sum = blogPosts.reduce((acc, post) => acc + post.rating, 0);
    return (sum / blogPosts.length).toFixed(1);
  };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">
            <MessageCircle size={32} />
          </div>
          <h1>Experiencias de Nuestros Clientes</h1>
          <p>
            Lee las historias reales de personas que han elegido un estilo de vida más sostenible con EcoVestir
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">{blogPosts.length}</div>
              <div className="stat-label">Reseñas</div>
            </div>
            <div className="stat">
                <div className="stat-rating">
                {calculateAverageRating()}
                <Star size={30} color="#FFD700" fill="#FFD700" />
              </div>
              <div className="stat-label">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </section>

      <div className="blog-container">
        <div className="blog-grid">
          {/* Formulario para nueva reseña */}
          <div className="blog-form-column">
            <div className="form-card">
              <div className="form-header">
                <Send className="form-icon" size={20} />
                <h3>Comparte tu Experiencia</h3>
              </div>
              <div className="form-content">
                <form onSubmit={handleSubmit} className="review-form">
                  <div className="form-group">
                    <label htmlFor="author">Nombre *</label>
                    <input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      required
                    />
                    <p className="form-help">No será publicado</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="title">Título *</label>
                    <input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Resumen de tu experiencia"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Tu Reseña *</label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Cuéntanos sobre tu experiencia con EcoVestir..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Calificación *</label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="rating-star-btn"
                        >
                          <Star 
                            size={32} 
                            color={star <= formData.rating ? '#FFD700' : '#D1D5DB'}
                            fill={star <= formData.rating ? '#FFD700' : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="submit-button">
                    <Send size={16} className="submit-icon" />
                    Publicar Reseña
                  </button>

                  <p className="form-terms">
                    Al publicar, aceptas nuestros términos y condiciones
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="blog-posts-column">
            <div className="posts-header">
              <h2>Todas las Reseñas</h2>
              <p>{blogPosts.length} experiencias compartidas por nuestra comunidad</p>
            </div>

            <div className="blog-posts-list">
              {blogPosts.map((post) => (
                <div key={post.id} className="blog-post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <div className="avatar">{post.author.charAt(0)}</div>
                      <div className="user-details">
                        <div className="user-name">
                          {post.author}
                          {post.verified && <span className="verified-badge">Verificado</span>}
                        </div>
                        <div className="post-date">📅 {post.date}</div>
                      </div>
                    </div>
                    <div className="post-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          color={i < post.rating ? '#FFD700' : '#E5E7EB'}
                          fill={i < post.rating ? '#FFD700' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="post-body">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-content">{post.content}</p>
                  </div>
                  {post.productName && post.productImage && (
                    <div className="post-product">
                      <img src={post.productImage} alt={post.productName} className="product-image" />
                      <div className="product-info">
                        <span className="product-label">Producto reseñado:</span>
                        <span className="product-name">{post.productName}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {blogPosts.length === 0 && (
              <div className="no-posts">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#9CA3AF" viewBox="0 0 16 16" className="no-posts-icon">
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.5l-1 1h4.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h4.5l-1-1H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                </svg>
                <p>Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}