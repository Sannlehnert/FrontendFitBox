import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faUser, faIdCard, faHeartbeat, faPhone,
  faSave, faSpinner, faCheckCircle, faExclamationTriangle,
  faArrowLeft, faTimes
} from '@fortawesome/free-solid-svg-icons';
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        setMessage({
          text: `Cliente registrado exitosamente (ID: ${data.id})`,
          type: 'success'
        });
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
        setMessage({
          text: data.error || 'Error al registrar cliente',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'Error de conexion con el servidor',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <FontAwesomeIcon icon={faUserPlus} className="text-secondary" />
              Registrar Nuevo Cliente
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
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} /> Nombre: *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                    required
                    maxLength="50"
                    placeholder="Ingresa el nombre"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} /> Apellido: *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                    required
                    maxLength="50"
                    placeholder="Ingresa el apellido"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faIdCard} /> DNI: *
                  </label>
                  <input
                    type="text"
                    name="DNI"
                    value={formData.DNI}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                    required
                    pattern="[0-9]{7,8}"
                    title="El DNI debe contener 7 u 8 numeros"
                    placeholder="Numero de DNI"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faHeartbeat} /> Lesiones/Enfermedades:
                  </label>
                  <input
                    type="text"
                    name="lesiones"
                    value={formData.lesiones}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                    placeholder="Opcional - Ej: Lesion de rodilla"
                    maxLength="100"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer relative pl-10 select-none font-semibold text-white">
                    <input
                      type="checkbox"
                      name="es_menor"
                      checked={formData.es_menor}
                      onChange={handleChange}
                      className="custom-checkbox"
                    />
                    <span className="checkmark"></span>
                    Es menor de edad?
                  </label>
                </div>

                {formData.es_menor && (
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhone} /> Telefono del tutor:
                    </label>
                    <input
                      type="tel"
                      name="telefono_tutor"
                      value={formData.telefono_tutor}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white/5 border border-secondary/20 rounded-xl text-white text-base transition-all duration-300 font-[inherit] backdrop-blur-lg focus:outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] focus:bg-white/[0.08] focus:-translate-y-px placeholder:text-gray-400"
                      placeholder="Numero de contacto del tutor"
                      pattern="[0-9]{10,15}"
                      title="Numero de telefono valido (10-15 digitos)"
                    />
                  </div>
                )}
              </div>

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
                      <FontAwesomeIcon icon={faSave} /> Registrar Cliente
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg cursor-pointer font-[inherit] transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 max-md:w-full"
                  onClick={() => navigate('/list-clients')}
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
