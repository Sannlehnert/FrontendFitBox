// src/pages/ListClients.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSearch, faUserPlus, faIdCard, faMoneyBillWave, faCalendarDay, faEye, faSpinner, faRefresh } from '@fortawesome/free-solid-svg-icons';
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
    if (!status) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white">Sin estado</span>;
    if (status.startsWith('DEBE:')) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-warning/20 text-warning border border-warning/30">{status}</span>;
    switch (status) {
      case 'Al día': return <span className="px-3 py-1 text-xs font-bold rounded-full bg-success/20 text-success border border-success/30">{status}</span>;
      case 'Vencido': return <span className="px-3 py-1 text-xs font-bold rounded-full bg-error/20 text-error border border-error/30">{status}</span>;
      default: return <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
          <p className="text-text-muted">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border-l-4 border-error rounded-lg p-6 text-error">
        <h4 className="font-bold">Error</h4>
        <p>{error}</p>
        <button onClick={fetchClients} className="mt-3 px-4 py-2 bg-error/20 rounded-full hover:bg-error/30 transition-all">
          <FontAwesomeIcon icon={faRefresh} /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg">
          <div className="p-5 border-b border-gold/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-secondary" />
                Lista de Clientes
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar clientes..."
                    className="pl-9 pr-4 py-2 bg-white/5 border border-gold/20 rounded-full text-white placeholder:text-text-muted focus:border-secondary focus:outline-none"
                  />
                </div>
                <button onClick={() => navigate('/register-client')} className="px-4 py-2 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-0.5 transition-all">
                  <FontAwesomeIcon icon={faUserPlus} /> Nuevo Cliente
                </button>
              </div>
            </div>
            <p className="mt-3 text-text-muted text-sm">Mostrando {filteredClients.length} de {clients.length} clientes</p>
          </div>

          <div className="p-6">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <FontAwesomeIcon icon={faSearch} size="3x" className="text-text-muted mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                    <p className="text-text-secondary">No hay clientes que coincidan con "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} className="mt-4 px-4 py-2 bg-gradient-gold text-black font-bold rounded-full">Limpiar búsqueda</button>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUsers} size="3x" className="text-text-muted mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">No hay clientes registrados</h3>
                    <p className="text-text-secondary">Comienza agregando tu primer cliente al sistema</p>
                    <button onClick={() => navigate('/register-client')} className="mt-4 px-4 py-2 bg-gradient-gold text-black font-bold rounded-full">
                      <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredClients.map(client => (
                  <div key={client.id_persona} className="bg-gradient-card border border-gold/10 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-white break-words">{client.nombre_completo || `${client.nombre} ${client.apellido}`}</h3>
                      {getStatusBadge(client.estado_pago)}
                    </div>
                    <div className="space-y-2 text-sm text-text-secondary mb-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faIdCard} />
                        <span>DNI: {client.DNI || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>Total pagado: ${client.total_pagado?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>Registro: {new Date(client.fecha_registro).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/client/${client.id_persona}`)} className="w-full py-2 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-0.5 transition-all">
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