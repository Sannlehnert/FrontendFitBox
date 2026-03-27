import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave, faCalendarDay, faDollarSign, faWallet,
  faSave, faSpinner, faCheckCircle, faExclamationTriangle,
  faArrowLeft, faTimes, faPlus
} from '@fortawesome/free-solid-svg-icons';
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
      setMessage({ text: 'Error de conexion', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      setMessage({ text: 'El monto total debe ser un numero valido mayor a 0', type: 'error' });
      return false;
    }
    if (showPartialPayments) {
      if (formData.pagos_parciales.length === 0) {
        setMessage({ text: 'Debe agregar al menos un pago parcial', type: 'error' });
        return false;
      }
      for (const pago of formData.pagos_parciales) {
        if (!pago.monto || isNaN(pago.monto) || parseFloat(pago.monto) <= 0) {
          setMessage({ text: 'Todos los montos parciales deben ser numeros validos mayores a 0', type: 'error' });
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
          ? formData.pagos_parciales.map(p => ({
              monto: parseFloat(p.monto),
              metodo_pago: p.metodo_pago
            }))
          : [{
              monto: parseFloat(formData.monto_total),
              metodo_pago: formData.metodo_pago
            }]
      };

      const response = await fetchWithAuth('/pagos', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al registrar pago');

      setMessage({
        text: `Pago registrado! Saldo pendiente: $${data.saldo_pendiente || '0.00'}`,
        type: 'success'
      });

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
      setMessage({
        text: `Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400";
  const selectClass = `${inputClass} select-gold`;

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-card border border-secondary/10 rounded-2xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-secondary" />
              <p className="text-gray-300">Cargando datos de clientes...</p>
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
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-secondary" />
              Registrar Pago
            </h2>
          </div>

          {/* Body */}
          <div className="p-6">
            {message.text && (
              <div className={`p-4 rounded-xl border-l-4 flex items-center gap-3 mb-4 ${
                message.type === 'success'
                  ? 'bg-success/10 border-success text-success'
                  : 'bg-error/10 border-error text-error'
              }`}>
                <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faExclamationTriangle} />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white">Cliente: *</label>
                  <select
                    name="id_persona"
                    value={formData.id_persona}
                    onChange={handleChange}
                    className={selectClass}
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

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDay} /> Fecha de Pago: *
                  </label>
                  <input
                    type="date"
                    name="fecha_pago"
                    value={formData.fecha_pago}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} /> Monto Total (ARS): *
                  </label>
                  <input
                    type="number"
                    name="monto_total"
                    value={formData.monto_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={inputClass}
                    required
                    disabled={isSubmitting}
                    placeholder="Ingresa el monto"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer relative pl-10 select-none font-semibold text-white">
                    <input
                      type="checkbox"
                      checked={showPartialPayments}
                      onChange={() => setShowPartialPayments(!showPartialPayments)}
                      className="custom-checkbox"
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    Pago parcial/multiples metodos?
                  </label>
                </div>
              </div>

              {showPartialPayments ? (
                <div className="mt-6 p-6 bg-white/[0.03] rounded-2xl border border-secondary/10">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faWallet} /> Pagos Parciales
                  </h4>
                  {formData.pagos_parciales.map((pago, index) => (
                    <div key={index} className="p-4 bg-white/[0.02] rounded-xl border border-secondary/5 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="font-semibold text-white">Monto: *</label>
                          <input
                            type="number"
                            name="monto"
                            value={pago.monto}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            min="0"
                            step="0.01"
                            className={inputClass}
                            required
                            disabled={isSubmitting}
                            placeholder="Monto parcial"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-semibold text-white">Metodo: *</label>
                          <select
                            name="metodo_pago"
                            value={pago.metodo_pago}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            className={selectClass}
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
                          className="mt-3 bg-error/10 border border-error/20 text-error px-4 py-2 rounded-full font-semibold text-sm cursor-pointer font-[inherit] transition-all duration-300 hover:bg-error/20 hover:-translate-y-0.5"
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
                    className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Agregar otro pago
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <label className="font-semibold text-white">Metodo de Pago: *</label>
                  <select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleChange}
                    className={selectClass}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              )}

              <div className="flex gap-4 mt-8 flex-wrap max-md:flex-col">
                <button
                  type="submit"
                  className="btn-shine bg-gradient-gold text-primary px-8 py-4 rounded-full font-semibold text-lg cursor-pointer border-none font-[inherit] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none max-md:w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Procesando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} /> Registrar Pago
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 max-md:w-full"
                  onClick={() => navigate('/list-clients')}
                  disabled={isSubmitting}
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
