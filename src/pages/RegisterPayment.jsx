// src/pages/RegisterPayment.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMoneyBillWave, faCalendarDay, faDollarSign, faWallet, faSave, faTimes, faSpinner, faCheckCircle, faExclamationTriangle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const RegisterPayment = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_persona: '',
    monto_total: '55000',
    fecha_pago: new Date().toISOString().split('T')[0],
    metodo_pago: 'efectivo',
    pagos_parciales: []
  });
  const [showPartialPayments, setShowPartialPayments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetchWithAuth('/clientes');
      const data = await response.json();
      if (response.ok) {
        setClients(data.data || []);
      } else {
        setMessage({ text: data.error || 'Error al cargar clientes', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartialPaymentChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newPagos = [...prev.pagos_parciales];
      newPagos[index] = { ...newPagos[index], [name]: value };
      return { ...prev, pagos_parciales: newPagos };
    });
  };

  const addPartialPayment = () => {
    setFormData(prev => ({
      ...prev,
      pagos_parciales: [...prev.pagos_parciales, { monto: '', metodo_pago: 'efectivo' }]
    }));
  };

  const removePartialPayment = (index) => {
    setFormData(prev => ({
      ...prev,
      pagos_parciales: prev.pagos_parciales.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.id_persona || !formData.monto_total || !formData.fecha_pago) {
      setMessage({ text: 'Cliente, monto total y fecha son obligatorios', type: 'error' });
      return false;
    }
    if (isNaN(formData.monto_total) || parseFloat(formData.monto_total) <= 0) {
      setMessage({ text: 'El monto total debe ser un número válido mayor a 0', type: 'error' });
      return false;
    }
    if (showPartialPayments) {
      if (formData.pagos_parciales.length === 0) {
        setMessage({ text: 'Debe agregar al menos un pago parcial', type: 'error' });
        return false;
      }
      for (const pago of formData.pagos_parciales) {
        if (!pago.monto || isNaN(pago.monto) || parseFloat(pago.monto) <= 0) {
          setMessage({ text: 'Todos los montos parciales deben ser números válidos mayores a 0', type: 'error' });
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        id_persona: formData.id_persona,
        monto_total: parseFloat(formData.monto_total),
        fecha_pago: formData.fecha_pago,
        pagos_parciales: showPartialPayments
          ? formData.pagos_parciales.map(p => ({ monto: parseFloat(p.monto), metodo_pago: p.metodo_pago }))
          : [{ monto: parseFloat(formData.monto_total), metodo_pago: formData.metodo_pago }]
      };

      const response = await fetchWithAuth('/pagos', { method: 'POST', body: JSON.stringify(payload) });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al registrar pago');

      setMessage({ text: `✅ Pago registrado! Saldo pendiente: $${data.saldo_pendiente || '0.00'}`, type: 'success' });
      setTimeout(() => {
        setFormData({
          id_persona: '',
          monto_total: '45000',
          fecha_pago: new Date().toISOString().split('T')[0],
          metodo_pago: 'efectivo',
          pagos_parciales: []
        });
        setShowPartialPayments(false);
      }, 2000);
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
          <p className="text-text-muted">Cargando datos de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg">
          <div className="p-5 border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-full text-text-secondary hover:bg-white/15 hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-secondary" />
              Registrar Pago
            </h2>
          </div>
          <div className="p-6">
            {message.text && (
              <div className={`flex items-center gap-2 p-4 mb-6 border-l-4 rounded-lg ${message.type === 'success' ? 'bg-success/10 border-success text-success' : 'bg-error/10 border-error text-error'}`}>
                <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faExclamationTriangle} />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white font-semibold mb-2">Cliente: *</label>
                  <select
                    name="id_persona"
                    value={formData.id_persona}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map(client => (
                      <option key={client.id_persona} value={client.id_persona}>
                        {client.nombre_completo} - {client.DNI}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faCalendarDay} /> Fecha de Pago: *
                  </label>
                  <input
                    type="date"
                    name="fecha_pago"
                    value={formData.fecha_pago}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faDollarSign} /> Monto Total (ARS): *
                  </label>
                  <input
                    type="number"
                    name="monto_total"
                    value={formData.monto_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    disabled={isSubmitting}
                    placeholder="Ingresa el monto"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-white font-semibold">
                    <input
                      type="checkbox"
                      checked={showPartialPayments}
                      onChange={() => setShowPartialPayments(!showPartialPayments)}
                      className="w-5 h-5 accent-gold"
                      disabled={isSubmitting}
                    />
                    ¿Pago parcial/múltiples métodos?
                  </label>
                </div>
              </div>

              {showPartialPayments ? (
                <div className="mt-6 p-5 bg-white/5 border border-gold/10 rounded-xl">
                  <h4 className="flex items-center gap-2 text-white font-semibold mb-4">
                    <FontAwesomeIcon icon={faWallet} /> Pagos Parciales
                  </h4>
                  {formData.pagos_parciales.map((pago, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/5 border border-gold/5 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-1">Monto: *</label>
                          <input
                            type="number"
                            name="monto"
                            value={pago.monto}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-white focus:border-secondary transition-all"
                            required
                            disabled={isSubmitting}
                            placeholder="Monto parcial"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-1">Método: *</label>
                          <select
                            name="metodo_pago"
                            value={pago.metodo_pago}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-white focus:border-secondary transition-all"
                            required
                            disabled={isSubmitting}
                          >
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="tarjeta">Tarjeta</option>
                          </select>
                        </div>
                      </div>
                      {formData.pagos_parciales.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePartialPayment(index)}
                          className="mt-3 px-3 py-1 bg-error/20 text-error text-sm rounded-full hover:bg-error/30 transition-all"
                          disabled={isSubmitting}
                        >
                          <FontAwesomeIcon icon={faTimes} /> Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPartialPayment}
                    className="mt-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Agregar otro pago
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-white font-semibold mb-2">Método de Pago: *</label>
                  <select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin /> Procesando...</> : <><FontAwesomeIcon icon={faSave} /> Registrar Pago</>}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/list-clients')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all"
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPayment;