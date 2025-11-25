// src/pages/Blog.jsx
import { useEffect, useState } from 'react';
import { Star, Send, MessageCircle, Calendar } from 'lucide-react';
import { obtenerReseñas, crearReseña } from '../api/reviews';
import './../style/blog.css';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  // Cargar reseñas al montar el componente
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const result = await obtenerReseñas({ limit: 50 });
      
      if (result.success) {
        setBlogPosts(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      alert('No se pudieron cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Verificar que el usuario esté autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para publicar una reseña');
      return;
    }

    setSubmitting(true);

    try {
      const result = await crearReseña(formData);

      if (result.success) {
        alert('¡Gracias por compartir tu experiencia! Tu reseña será publicada después de su revisión.');
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          rating: 5,
        });

        // Opcional: refrescar lista después de un tiempo
        // setTimeout(() => fetchReviews(), 1000);
      } else {
        alert(result.message || 'Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'No se pudo enviar la reseña. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    return stats.averageRating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Cargando reseñas...
        </div>
      </div>
    );
  }

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
              <div className="stat-number">{stats.totalReviews}</div>
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
                    <label htmlFor="title">Título *</label>
                    <input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Resumen de tu experiencia"
                      required
                      disabled={submitting}
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
                      disabled={submitting}
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
                          disabled={submitting}
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

                  <button type="submit" className="submit-button" disabled={submitting}>
                    <Send size={16} className="submit-icon" />
                    {submitting ? 'Enviando...' : 'Publicar Reseña'}
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
              <p>{stats.totalReviews} experiencias compartidas por nuestra comunidad</p>
            </div>

            <div className="blog-posts-list">
              {blogPosts.map((post) => (
                <div key={post._id} className="blog-post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <div className="avatar">{post.author.charAt(0)}</div>
                      <div className="user-details">
                        <div className="user-name">
                          {post.author}
                          {post.verified && <span className="verified-badge">Verificado</span>}
                        </div>
                        <div className="post-date">
                          <Calendar size={14} />
                          {new Date(post.createdAt).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
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
                </div>
              ))}
            </div>

            {blogPosts.length === 0 && (
              <div className="no-posts">
                <MessageCircle size={64} color="#9CA3AF" />
                <p>Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}