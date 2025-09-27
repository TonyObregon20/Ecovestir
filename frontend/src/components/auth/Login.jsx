// src/components/auth/Login.js
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/auth';
import '../../login.css';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login: loginUser } = useAuth(); // Renombramos para evitar conflicto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      console.log('Login exitoso:', response);
      
      // Usar el hook para guardar la sesión
      loginUser(response.token, response.user);

      // Redirigir al inicio
      window.location.href = '/';

    } catch (err) {
      setError(err.message);
      console.error('Error al iniciar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="auth-input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="auth-input auth-input-with-icon"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Mail className="auth-input-icon" size={16} color="#7f8c8d" />
      </div>

      {/* Contraseña */}
      <div className="auth-input-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="auth-input auth-input-with-icon"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Lock className="auth-input-icon" size={16} color="#7f8c8d" />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          {showPassword ? (
            <EyeOff size={16} color="#7f8c8d" />
          ) : (
            <Eye size={16} color="#7f8c8d" />
          )}
        </button>
      </div>

      {/* Recordarme + Olvidaste contraseña */}
      <div className="auth-checkbox-group">
        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          Recordarme
        </label>
        <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botón de login */}
      <button type="submit" className="auth-submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      {/* Footer: ¿No tienes cuenta? */}
      <div className="auth-footer">
        ¿No tienes cuenta? <a href="/login#register" className="auth-link">Regístrate aquí</a>
      </div>
    </form>
  );
};

export default Login;