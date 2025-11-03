// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Leaf } from 'lucide-react';
import "../style/login.css";
import { useCart } from '../Context/useCart';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
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
      setAcceptTerms(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Logo fuera del contenedor */}
      <div className="auth-logo-outside">
        <img src="/logo.png" alt="EcoVestir Logo" />
        <h1>EcoVestir</h1>
      </div>
      
      <p className="auth-subtitle-outside">Moda sostenible para un futuro mejor</p>

      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <h2>Accede a tu cuenta</h2>
          <p>Únete a nuestra comunidad sostenible</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError("");
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError("");
              setAcceptTerms(false);
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error" role="alert" aria-live="assertive">
              <span className="auth-error-icon">
                <Leaf />
              </span>
              <span>{error}</span>
            </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {/* Nombre completo - solo en registro */}
          {mode === 'register' && (
            <div className="form-field space-y-2">
              <label htmlFor="name">Nombre completo</label>
              <div className="input-wrapper relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={mode === 'register'}
                  disabled={loading}
                  placeholder="Tu nombre completo"
                  className="pl-10 border-green-200 focus:border-green-600"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="form-field space-y-2">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="tu@email.com"
                className="pl-10 border-green-200 focus:border-green-600"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-field space-y-2">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="••••••••"
                className="pl-10 pr-10 border-green-200 focus:border-green-600"
              />
              <button
                type="button"
                className="password-toggle absolute right-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña - solo en registro */}
          {mode === 'register' && (
            <div className="form-field space-y-2">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="input-wrapper relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={mode === 'register'}
                  disabled={loading}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-green-200 focus:border-green-600"
                />
                <button
                  type="button"
                  className="password-toggle absolute right-3 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-pressed={showConfirmPassword}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Recordarme y Olvidaste contraseña - solo en login */}
          {mode === 'login' && (
            <div className="remember-forgot-container">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Recordarme</label>
              </div>
              <div className="forgot-password">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          )}

          {/* Términos - solo en registro */}
          {mode === 'register' && (
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="acceptTerms">
                Acepto los <a href="#" onClick={(e) => e.preventDefault()}>términos y condiciones</a> y la <a href="#" onClick={(e) => e.preventDefault()}>política de privacidad</a>
              </label>
            </div>
          )}

          {/* Submit button */}
          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading 
              ? "Procesando..." 
              : mode === 'login' 
                ? "Iniciar Sesión" 
                : "Crear Cuenta"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError("");
                }}
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError("");
                  setAcceptTerms(false);
                }}
              >
                Inicia sesión aquí
              </button>
            </>
          )}
        </div>

        {/* Botón volver al inicio */}
        <button 
          type="button"
          className="back-button"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}