// src/pages/SearchClient.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faIdCard, faCalendarDay, faEye, faSpinner, faCheckCircle, faExclamationTriangle, faInfoCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
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
        throw new Error(errorData.error || 'Error en la búsqueda');
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

  const handleViewDetails = (id) => navigate(`/client/${id}`);

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg">
          <div className="p-5 border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-full text-text-secondary hover:bg-white/15 hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} className="text-secondary" />
              Buscar Cliente
            </h2>
          </div>
          <div className="p-6">
            {message.text && (
              <div className={`flex items-center gap-2 p-4 mb-6 border-l-4 rounded-lg ${
                message.type === 'success' ? 'bg-success/10 border-success text-success' :
                message.type === 'error' ? 'bg-error/10 border-error text-error' :
                'bg-info/10 border-info text-info'
              }`}>
                <FontAwesomeIcon icon={
                  message.type === 'success' ? faCheckCircle :
                  message.type === 'error' ? faExclamationTriangle :
                  faInfoCircle
                } />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-5 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="px-6 py-3 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />}
                  Buscar
                </button>
              </div>
            </form>

            {loading ? (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
                <p className="mt-2 text-text-muted">Buscando clientes...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4">Resultados de la búsqueda</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {results.map(client => (
                    <div key={client.id_persona} className="bg-gradient-card border border-gold/10 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                      <h3 className="text-lg font-bold text-white mb-2">{client.nombre_completo}</h3>
                      <div className="space-y-2 text-sm text-text-secondary mb-4">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faIdCard} />
                          <span>DNI: {client.DNI}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendarDay} />
                          <span>Último pago: {client.ultimo_pago || 'Nunca'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(client.id_persona)}
                        className="w-full py-2 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver detalles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchTerm && !loading && (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faUsers} size="3x" className="text-text-muted mb-3" />
                <p className="text-text-secondary">No se encontraron clientes</p>
                <small className="text-text-muted">Intenta con otros términos de búsqueda</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchClient;