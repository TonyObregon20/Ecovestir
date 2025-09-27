// src/components/auth/Register.js
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { register } from '../../api/auth';
import '../../login.css';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const { login: loginUser } = useAuth(); // Renombramos para evitar conflicto
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await register(name, email, password);
      console.log('Registro exitoso:', response);
      
      // Usar el hook para guardar la sesión
      loginUser(response.token, response.user);

      // Redirigir al inicio
      window.location.href = '/';

    } catch (err) {
      setError(err.message);
      console.error('Error al registrarse:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Nombre completo */}
      <div className="auth-input-group">
        <label htmlFor="name">Nombre completo</label>
        <input
          id="name"
          type="text"
          className="auth-input auth-input-with-icon"
          placeholder="Tu nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <User className="auth-input-icon" size={16} color="#7f8c8d" />
      </div>

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

      {/* Confirmar contraseña */}
      <div className="auth-input-group">
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          className="auth-input auth-input-with-icon"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Lock className="auth-input-icon" size={16} color="#7f8c8d" />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={loading}
        >
          {showConfirmPassword ? (
            <EyeOff size={16} color="#7f8c8d" />
          ) : (
            <Eye size={16} color="#7f8c8d" />
          )}
        </button>
      </div>

      {/* Aceptar términos */}
      <div className="auth-checkbox-group">
        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={loading}
          />
          Acepto los <a href="#" className="auth-link">términos y condiciones</a> y la <a href="#" className="auth-link">política de privacidad</a>
        </label>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botón de registro */}
      <button type="submit" className="auth-submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      {/* Footer: ¿Ya tienes cuenta? */}
      <div className="auth-footer">
        ¿Ya tienes cuenta? <a href="/login" className="auth-link">Inicia sesión aquí</a>
      </div>
    </form>
  );
};

export default Register;