// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useCart } from '../context/CartContext';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // solo usado en registro
    confirmPassword: "" // solo usado en registro
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchCart } = useCart();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Manejo de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError("Acceso denegado. Solo administradores.");
        } else {
          setError(data.message || "Credenciales inválidas");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      refetchCart();

      if (data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/productos");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("Error de conexión. ¿Está corriendo tu backend?");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manejo de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones locales
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "customer" // 👈 siempre cliente en registro
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la cuenta");
      }

      // ✅ Registro exitoso: mostrar mensaje y cambiar a login
      alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
      setMode('login');
      setFormData({ email: formData.email, password: "", name: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">🍃</span>
          <h2>EcoVestir</h2>
        </div>

        {/* 👇 Pestañas */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '12px'
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 12px',
              color: mode === 'login' ? '#059669' : '#6b7280',
              fontWeight: mode === 'login' ? 'bold' : 'normal',
              cursor: 'pointer',
              borderBottom: mode === 'login' ? '2px solid #059669' : 'none'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 12px',
              color: mode === 'register' ? '#059669' : '#6b7280',
              fontWeight: mode === 'register' ? 'bold' : 'normal',
              cursor: 'pointer',
              borderBottom: mode === 'register' ? '2px solid #059669' : 'none'
            }}
          >
            Registrarse
          </button>
        </div>

        <h3>{mode === 'login' ? 'Iniciar Sesión' : 'Crear una Cuenta'}</h3>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {/* 👇 Campo de nombre (solo en registro) */}
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={mode === 'register'}
                disabled={loading}
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {/* 👇 Confirmar contraseña (solo en registro) */}
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={mode === 'register'}
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading 
              ? "Procesando..." 
              : mode === 'login' 
                ? "Iniciar Sesión" 
                : "Crear Cuenta"}
          </button>
        </form>

        {/* 👇 Enlace alternativo */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}