'use client';

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Fondo con imagen */}
      <div className="login-bg"></div>
      
      {/* Contenedor principal */}
      <div className="login-wrapper">
        {/* Formulario de login */}
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-title">Log in</h2>
            <p className="login-subtitle">Ingresa a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Mensaje de error */}
            {error && (
              <Alert variant="destructive" className="login-error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Campo de email */}
            <div className="login-input-group">
              <div className="login-input-wrapper">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="login-input"
                  required
                />
                <span className="login-input-focus"></span>
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="login-input-group">
              <div className="login-input-wrapper">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="login-input"
                  required
                />
                <span className="login-input-focus"></span>
              </div>
            </div>

            {/* Checkbox Remember me */}
            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            {/* Botón de login */}
            <Button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="login-loading">
                  <div className="spinner"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>

            {/* Enlace Forgot Password */}
            <div className="login-forgot">
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
          </form>

          
        </div>

        {/* Panel derecho con imagen */}
        <div className="login-image-container">
          <div className="login-image-content">
            <div className="login-logo">
              <span className="logo-icon">🏥</span>
            </div>
            <h1 className="login-brand">Asis Medical</h1>
            <p className="login-description">
              Sistema de Gestión Médica Avanzado
            </p>
            <div className="login-features">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span className="feature-text">Gestión de Pacientes</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📋</span>
                <span className="feature-text">Historias Clínicas</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💊</span>
                <span className="feature-text">Control de Medicamentos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 