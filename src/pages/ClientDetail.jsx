import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faIdCard, faMoneyBillWave, faSpinner,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
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

        if (!clientData.data || !paymentsData.data) {
          throw new Error('Datos incompletos del servidor');
        }

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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
              <p className="text-gray-300">Cargando detalles del cliente...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-6">
            <div className="p-4 rounded-xl border-l-4 bg-error/10 border-error text-error">
              <h4 className="font-bold text-lg">Error</h4>
              <p className="mt-2">{error}</p>
              <button
                className="bg-white/[0.08] text-gray-300 border border-white/15 px-5 py-3 rounded-full font-semibold cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:text-white mt-4"
                onClick={() => navigate('/list-clients')}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-6">
            <div className="p-4 rounded-xl border-l-4 bg-warning/10 border-warning text-warning">
              <h4 className="font-bold text-lg">Cliente no encontrado</h4>
              <button
                className="bg-white/[0.08] text-gray-300 border border-white/15 px-5 py-3 rounded-full font-semibold cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:text-white mt-4"
                onClick={() => navigate('/list-clients')}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 max-md:text-xl max-md:text-center max-md:w-full">
              <FontAwesomeIcon icon={faUser} className="text-secondary" />
              {client.nombre} {client.apellido}
            </h2>
            <button
              className="bg-white/10 text-white border border-white/20 px-5 py-3 rounded-full font-semibold cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              onClick={() => navigate('/register-payment', { state: { clientId: id } })}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex flex-col gap-8">
              {/* Personal info */}
              <div className="bg-gradient-card border border-secondary/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-secondary/10">
                  <FontAwesomeIcon icon={faIdCard} className="text-secondary" /> Informacion Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-white text-sm">DNI:</label>
                    <p className="text-gray-300 break-words">{client.DNI}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-white text-sm">Fecha de registro:</label>
                    <p className="text-gray-300">{new Date(client.fecha_registro).toLocaleDateString()}</p>
                  </div>
                  {client.telefono_tutor && (
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-white text-sm">Telefono tutor:</label>
                      <p className="text-gray-300">{client.telefono_tutor}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-semibold text-white text-sm">Lesiones/Enfermedades:</label>
                    <p className="text-gray-300">{client.lesiones || 'Ninguna registrada'}</p>
                  </div>
                </div>
              </div>

              {/* Payment history */}
              <div className="bg-gradient-card border border-secondary/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-3 border-b border-secondary/10">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-secondary" /> Historial de Pagos
                </h3>

                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FontAwesomeIcon icon={faMoneyBillWave} size="2x" className="opacity-70 mb-4" />
                    <p className="mb-6">No hay registros de pago</p>
                    <button
                      className="btn-shine bg-gradient-gold text-primary px-6 py-3 rounded-full font-semibold cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      onClick={() => navigate('/register-payment', { state: { clientId: id } })}
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Primer Pago
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {payments.map((payment, index) => (
                      <div key={index} className="payment-bar bg-gradient-card border border-secondary/10 rounded-2xl p-6 relative transition-all duration-300 hover:border-secondary/20 hover:translate-x-1 max-md:pl-4">
                        <div className="flex justify-between items-center mb-3 flex-wrap gap-3 max-md:flex-col max-md:items-start">
                          <h4 className="text-white font-bold text-lg">{payment.mes_pagado}</h4>
                          <span className="text-gray-400 text-sm">{payment.fecha}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 font-medium">Total:</label>
                            <span className="text-xl font-bold text-white">${payment.monto_total.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 font-medium">Pagado:</label>
                            <span className="text-xl font-bold text-success">${payment.monto_pagado.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 font-medium">Saldo:</label>
                            <span className={`text-xl font-bold ${payment.saldo_pendiente > 0 ? 'text-warning' : 'text-success'}`}>
                              ${payment.saldo_pendiente.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {payment.detalle_pagos?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-secondary/10">
                            <h5 className="text-white font-semibold mb-3">Detalles de pago:</h5>
                            <ul className="list-none p-0">
                              {payment.detalle_pagos.map((detalle, i) => (
                                <li key={i} className="py-2 text-gray-300 border-b border-white/5 last:border-b-0">{detalle}</li>
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
