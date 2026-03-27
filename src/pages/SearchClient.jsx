import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faSpinner, faCheckCircle, faExclamationTriangle,
  faInfoCircle, faArrowLeft, faIdCard, faCalendarDay, faEye, faUsers
} from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const SearchClient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm || searchTerm.trim().length < 2) {
      setMessage({ text: 'Ingrese al menos 2 caracteres', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`/buscar-cliente?query=${encodeURIComponent(searchTerm.trim())}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la busqueda');
      }

      const data = await response.json();
      setResults(data.data || []);
      setMessage({
        text: data.data.length ? `Se encontraron ${data.data.length} resultados` : 'No se encontraron resultados',
        type: data.data.length ? 'success' : 'info'
      });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/client/${id}`);
  };

  const getAlertIcon = (type) => {
    if (type === 'success') return faCheckCircle;
    if (type === 'error') return faExclamationTriangle;
    return faInfoCircle;
  };

  const getAlertClass = (type) => {
    if (type === 'success') return 'bg-success/10 border-success text-success';
    if (type === 'error') return 'bg-error/10 border-error text-error';
    return 'bg-info/10 border-info text-info';
  };

  return (
    <div className="py-6 fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-card backdrop-blur-lg border border-secondary/10 rounded-2xl shadow-2xl relative overflow-hidden card-gold-line transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:border-secondary/20">
          {/* Header */}
          <div className="p-6 border-b border-secondary/10 flex items-center justify-between gap-4 flex-wrap max-md:flex-col max-md:items-start">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/[0.08] text-gray-300 border border-white/15 px-5 py-3 rounded-full font-semibold cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:text-white"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faSearch} className="text-secondary" />
              Buscar Cliente
            </h2>
          </div>

          {/* Body */}
          <div className="p-6">
            {message.text && (
              <div className={`p-4 rounded-xl border-l-4 flex items-center gap-3 mb-4 ${getAlertClass(message.type)}`}>
                <FontAwesomeIcon icon={getAlertIcon(message.type)} />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-3 w-full max-md:flex-col">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn-shine bg-gradient-gold text-primary px-6 py-4 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  disabled={loading || !searchTerm.trim()}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faSearch} />
                  )}
                  <span>Buscar</span>
                </button>
              </div>
            </form>

            {loading ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
                <p className="text-gray-300">Buscando clientes...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-white font-bold text-xl mb-4">Resultados de la busqueda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map(client => (
                    <div key={client.id_persona} className="bg-gradient-card border border-secondary/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-secondary/20 relative overflow-hidden flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white break-words">{client.nombre_completo}</h3>
                      </div>
                      <div className="flex flex-col gap-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FontAwesomeIcon icon={faIdCard} />
                          <span>DNI: {client.DNI}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FontAwesomeIcon icon={faCalendarDay} />
                          <span>Ultimo pago: {client.ultimo_pago || 'Nunca'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(client.id_persona)}
                        className="btn-shine bg-gradient-gold text-primary w-full py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver detalles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchTerm && !loading && (
              <div className="text-center py-12 text-gray-400">
                <FontAwesomeIcon icon={faUsers} size="3x" className="opacity-70 mb-4" />
                <p className="text-lg">No se encontraron clientes</p>
                <small>Intenta con otros terminos de busqueda</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchClient;
