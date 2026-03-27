// src/pages/ClientDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faIdCard, faCalendarDay, faPhone, faHeartbeat, faMoneyBillWave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const clientRes = await fetchWithAuth(`/clientes/${id}`);
        if (!clientRes.ok) throw new Error('Error al cargar cliente');
        const clientData = await clientRes.json();

        const paymentsRes = await fetchWithAuth(`/clientes/${id}/pagos-detallados`);
        if (!paymentsRes.ok) throw new Error('Error al cargar pagos');
        const paymentsData = await paymentsRes.json();

        if (!clientData.data || !paymentsData.data) throw new Error('Datos incompletos del servidor');
        setClient(clientData.data);
        setPayments(paymentsData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
          <p className="text-text-muted">Cargando detalles del cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border-l-4 border-error rounded-lg p-6 text-error">
        <h4 className="font-bold">Error</h4>
        <p>{error}</p>
        <button onClick={() => navigate('/list-clients')} className="mt-3 px-4 py-2 bg-error/20 rounded-full hover:bg-error/30 transition-all">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver a la lista
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-6 text-warning">
        <h4 className="font-bold">Cliente no encontrado</h4>
        <button onClick={() => navigate('/list-clients')} className="mt-3 px-4 py-2 bg-warning/20 rounded-full hover:bg-warning/30 transition-all">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg">
          <div className="p-5 border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-full text-text-secondary hover:bg-white/15 hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-secondary" />
              {client.nombre} {client.apellido}
            </h2>
            <button onClick={() => navigate('/register-payment', { state: { clientId: id } })} className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {/* Información personal */}
              <div className="bg-white/5 border border-gold/10 rounded-xl p-5">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b border-gold/10 mb-4">
                  <FontAwesomeIcon icon={faIdCard} /> Información Personal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-text-primary font-semibold">DNI:</label>
                    <p className="text-text-secondary break-words">{client.DNI}</p>
                  </div>
                  <div>
                    <label className="block text-text-primary font-semibold">Fecha de registro:</label>
                    <p className="text-text-secondary">{new Date(client.fecha_registro).toLocaleDateString()}</p>
                  </div>
                  {client.telefono_tutor && (
                    <div>
                      <label className="block text-text-primary font-semibold">Teléfono tutor:</label>
                      <p className="text-text-secondary">{client.telefono_tutor}</p>
                    </div>
                  )}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-text-primary font-semibold">Lesiones/Enfermedades:</label>
                    <p className="text-text-secondary">{client.lesiones || 'Ninguna registrada'}</p>
                  </div>
                </div>
              </div>

              {/* Historial de pagos */}
              <div className="bg-white/5 border border-gold/10 rounded-xl p-5">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b border-gold/10 mb-4">
                  <FontAwesomeIcon icon={faMoneyBillWave} /> Historial de Pagos
                </h3>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faMoneyBillWave} size="2x" className="text-text-muted mb-2" />
                    <p className="text-text-secondary">No hay registros de pago</p>
                    <button onClick={() => navigate('/register-payment', { state: { clientId: id } })} className="mt-3 px-4 py-2 bg-gradient-gold text-black font-bold rounded-full">
                      <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Primer Pago
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment, index) => (
                      <div key={index} className="bg-white/5 border border-gold/10 rounded-xl p-4 hover:translate-x-1 transition-all">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <h4 className="text-lg font-bold text-white">{payment.mes_pagado}</h4>
                          <span className="text-text-muted text-sm">{payment.fecha}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-text-muted text-sm">Total:</label>
                            <span className="text-white font-bold">${payment.monto_total.toFixed(2)}</span>
                          </div>
                          <div>
                            <label className="block text-text-muted text-sm">Pagado:</label>
                            <span className="text-success font-bold">${payment.monto_pagado.toFixed(2)}</span>
                          </div>
                          <div>
                            <label className="block text-text-muted text-sm">Saldo:</label>
                            <span className={`font-bold ${payment.saldo_pendiente > 0 ? 'text-warning' : 'text-success'}`}>
                              ${payment.saldo_pendiente.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {payment.detalle_pagos?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gold/10">
                            <h5 className="text-white font-semibold mb-2">Detalles de pago:</h5>
                            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                              {payment.detalle_pagos.map((detalle, i) => (
                                <li key={i}>{detalle}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;