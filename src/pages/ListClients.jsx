import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faSearch, faUserPlus, faSpinner, faRefresh,
  faIdCard, faMoneyBillWave, faCalendarDay, faEye
} from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth('/clientes');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setClients(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (client.nombre_completo && client.nombre_completo.toLowerCase().includes(term)) ||
      (client.DNI && client.DNI.toString().includes(term))
    );
  });

  const getStatusBadge = (status) => {
    if (!status) return <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-white/10 text-gray-400">Sin estado</span>;
    if (status.startsWith('DEBE:')) return <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-warning/20 text-warning border border-warning/30">{status}</span>;
    switch (status) {
      case 'Al dia': return <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-success/20 text-success border border-success/30">{status}</span>;
      case 'Vencido': return <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-error/20 text-error border border-error/30">{status}</span>;
      default: return <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-white/10 text-gray-400">{status}</span>;
    }
  };

  if (loading) return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
            <p className="text-gray-300">Cargando clientes...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-6">
          <div className="p-4 rounded-xl border-l-4 bg-error/10 border-error text-error">
            <h4 className="font-bold text-lg">Error</h4>
            <p className="mt-2">{error}</p>
            <button
              className="btn-shine bg-gradient-gold text-primary px-6 py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl mt-4"
              onClick={fetchClients}
            >
              <FontAwesomeIcon icon={faRefresh} /> Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6 fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-card backdrop-blur-lg border border-secondary/10 rounded-2xl shadow-2xl relative overflow-hidden card-gold-line transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:border-secondary/20">
          {/* Header */}
          <div className="p-6 border-b border-secondary/10">
            <div className="flex items-center justify-between gap-4 flex-wrap max-md:flex-col max-md:items-start">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-secondary" />
                Lista de Clientes
              </h2>
              <div className="flex items-center gap-4 flex-wrap max-md:flex-col max-md:w-full max-md:gap-3">
                <div className="relative flex items-center bg-white/5 border border-secondary/20 rounded-xl px-4 py-3 transition-all duration-300 focus-within:border-secondary focus-within:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] min-w-[250px] max-md:w-full max-md:min-w-0">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar clientes..."
                    className="bg-transparent border-none text-white text-base w-full ml-2 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                <button
                  className="btn-shine bg-gradient-gold text-primary px-5 py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl max-md:w-full"
                  onClick={() => navigate('/register-client')}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Nuevo Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <p className="text-gray-400 text-sm">
                Mostrando {filteredClients.length} de {clients.length} clientes
              </p>
            </div>

            {filteredClients.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {searchTerm ? (
                  <>
                    <FontAwesomeIcon icon={faSearch} size="3x" className="opacity-70 mb-4" />
                    <h3 className="text-white text-xl font-bold mb-3">No se encontraron resultados</h3>
                    <p className="text-lg mb-6">No hay clientes que coincidan con &ldquo;{searchTerm}&rdquo;</p>
                    <button
                      className="btn-shine bg-gradient-gold text-primary px-6 py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      onClick={() => setSearchTerm('')}
                    >
                      Limpiar busqueda
                    </button>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUsers} size="3x" className="opacity-70 mb-4" />
                    <h3 className="text-white text-xl font-bold mb-3">No hay clientes registrados</h3>
                    <p className="text-lg mb-6">Comienza agregando tu primer cliente al sistema</p>
                    <button
                      className="btn-shine bg-gradient-gold text-primary px-6 py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      onClick={() => navigate('/register-client')}
                    >
                      <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                  <div key={client.id_persona} className="bg-gradient-card border border-secondary/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-secondary/20 relative overflow-hidden flex flex-col min-h-[200px]">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 break-words">{client.nombre_completo || `${client.nombre} ${client.apellido}`}</h3>
                        <div className="flex gap-2 flex-wrap">
                          {getStatusBadge(client.estado_pago)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-gray-300 text-sm flex-wrap">
                        <FontAwesomeIcon icon={faIdCard} />
                        <span>DNI: {client.DNI || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm flex-wrap">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>Total pagado: ${client.total_pagado?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm flex-wrap">
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>Registro: {new Date(client.fecha_registro).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/client/${client.id_persona}`)}
                      className="btn-shine bg-gradient-gold text-primary w-full py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <FontAwesomeIcon icon={faEye} /> Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListClients;
