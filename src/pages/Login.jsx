// src/pages/Login.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('fitbox_token', data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-primary relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,215,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
      <div className="relative bg-gradient-card backdrop-blur-xl border border-gold/10 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold" />
        <div className="text-center mb-10">
          <div className="mb-4">
            <FontAwesomeIcon icon={faIdCard} className="text-secondary text-5xl mb-2" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
              FIT<span className="text-secondary">BOX</span>
            </h1>
          </div>
          <p className="text-text-muted">Sistema de Gestión de Gimnasio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-primary font-semibold mb-2">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-5 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] focus:bg-white/10 transition-all"
              required
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div>
            <label className="block text-text-primary font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-5 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] focus:bg-white/10 transition-all"
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-error/10 border-l-4 border-error rounded-lg text-error">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <><FontAwesomeIcon icon={faSpinner} spin /> Procesando...</>
            ) : (
              <><FontAwesomeIcon icon={faUser} /> Iniciar Sesión</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;