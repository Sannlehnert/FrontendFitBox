import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard, faUser, faSpinner, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, '');

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('fitbox_token', data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Error de autenticacion');
      }
    } catch (err) {
      setError('Error de conexion con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary to-dark relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="bg-gradient-card backdrop-blur-xl border border-secondary/10 rounded-3xl p-10 w-full max-w-[440px] shadow-2xl relative overflow-hidden">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-6">
            <FontAwesomeIcon icon={faIdCard} className="text-secondary text-6xl mb-4" />
            <div className="text-4xl font-extrabold text-gradient tracking-tight">
              FIT<span className="text-secondary">BOX</span>
            </div>
          </div>
          <p className="text-gray-400 text-lg mt-3">Sistema de Gestion de Gimnasio</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="text-left">
            <label className="block mb-3 font-semibold text-white text-base">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-5 py-4 bg-white/[0.06] border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] focus:bg-white/10"
              required
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="text-left">
            <label className="block mb-3 font-semibold text-white text-base">Contrasena</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-5 py-4 bg-white/[0.06] border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] focus:bg-white/10"
              required
              placeholder="Ingresa tu contrasena"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl border-l-4 border-error bg-error/10 text-error flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-shine bg-gradient-gold text-primary border-none w-full py-5 text-lg font-bold rounded-full transition-all duration-300 cursor-pointer mt-6 uppercase tracking-wider font-[inherit] hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUser} /> Iniciar Sesion
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
