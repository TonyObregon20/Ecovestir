// src/components/auth/AuthForm.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AuthForm = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Si ya está autenticado, redirigir al inicio
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo de EcoVestir: Leaf dentro de círculo verde clarito */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#e6f9f0] rounded-full flex items-center justify-center mb-2 border border-green-300">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">EcoVestir</span>
          <p className="text-sm text-gray-600 mt-1">Moda sostenible para un futuro mejor</p>
        </div>

        <h2 className="mt-4">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <p className="text-sm text-gray-500 mb-6">Únete a nuestra comunidad sostenible</p>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </div>
          <div
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </div>
        </div>

        {isLogin ? <Login /> : <Register />}

        <button className="auth-back-button" onClick={() => window.location.href = '/'}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default AuthForm;