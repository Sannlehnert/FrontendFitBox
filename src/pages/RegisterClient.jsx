// src/pages/RegisterClient.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserPlus, faUser, faIdCard, faHeartbeat, faPhone, faSave, faTimes, faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../services/api';

const RegisterClient = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    DNI: '',
    lesiones: '',
    es_menor: false,
    telefono_tutor: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    if (!formData.nombre || !formData.apellido || !formData.DNI) {
      setMessage({ text: 'Nombre, apellido y DNI son campos obligatorios', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetchWithAuth('/personas', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Cliente registrado exitosamente (ID: ${data.id})`, type: 'success' });
        setFormData({
          nombre: '',
          apellido: '',
          DNI: '',
          lesiones: '',
          es_menor: false,
          telefono_tutor: ''
        });
        setTimeout(() => navigate('/list-clients'), 2000);
      } else {
        setMessage({ text: data.error || 'Error al registrar cliente', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error de conexión con el servidor', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg">
          <div className="p-5 border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate(-1)} className="btn-back flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-full text-text-secondary hover:bg-white/15 hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faUserPlus} className="text-secondary" />
              Registrar Nuevo Cliente
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faUser} /> Nombre: *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    maxLength="50"
                    placeholder="Ingresa el nombre"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faUser} /> Apellido: *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    maxLength="50"
                    placeholder="Ingresa el apellido"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faIdCard} /> DNI: *
                  </label>
                  <input
                    type="text"
                    name="DNI"
                    value={formData.DNI}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    required
                    pattern="[0-9]{7,8}"
                    title="El DNI debe contener 7 u 8 números"
                    placeholder="Número de DNI"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <FontAwesomeIcon icon={faHeartbeat} /> Lesiones/Enfermedades:
                  </label>
                  <input
                    type="text"
                    name="lesiones"
                    value={formData.lesiones}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                    placeholder="Opcional - Ej: Lesión de rodilla"
                    maxLength="100"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center gap-2 text-white font-semibold mb-2">
                    <input
                      type="checkbox"
                      name="es_menor"
                      checked={formData.es_menor}
                      onChange={handleChange}
                      className="w-5 h-5 accent-gold"
                    />
                    ¿Es menor de edad?
                  </label>
                </div>
                {formData.es_menor && (
                  <div>
                    <label className="flex items-center gap-2 text-white font-semibold mb-2">
                      <FontAwesomeIcon icon={faPhone} /> Teléfono del tutor:
                    </label>
                    <input
                      type="tel"
                      name="telefono_tutor"
                      value={formData.telefono_tutor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white placeholder:text-text-muted focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] transition-all"
                      placeholder="Número de contacto del tutor"
                      pattern="[0-9]{10,15}"
                      title="Número de teléfono válido (10-15 dígitos)"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-black font-bold rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin /> Procesando...</> : <><FontAwesomeIcon icon={faSave} /> Registrar Cliente</>}
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

export default RegisterClient;