import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faUserPlus, faMoneyBillWave, faSearch, faUsers,
  faIdCard, faHeartbeat, faSave, faCalendarAlt,
  faDollarSign, faWallet, faPhone, faUser, faCalendarDay,
  faSpinner, faBars, faTimes, faSignOutAlt, faInfoCircle,
  faCheckCircle, faExclamationTriangle, faArrowLeft, faPlus, 
  faRefresh, faEye, faChartLine, faStar, faEdit
} from '@fortawesome/free-solid-svg-icons';
import './App.css';

// Asegúrate de que esta URL sea correcta para tu backend
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, '');

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('fitbox_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('fitbox_token');
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      throw error;
    }
    throw new Error('Network error');
  }
};

const isTokenValid = () => {
  const token = localStorage.getItem('fitbox_token');
  return !!token;
};

function App() {
  return <AppRouter />;
}

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    const checkAuth = () => {
      const valid = isTokenValid();
      if (!valid && isAuthenticated) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedApp setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Routes>
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      )}
    </Router>
  );
};

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('fitbox_token', data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FontAwesomeIcon icon={faIdCard} className="logo-icon" />
            <span className="logo-text">FIT<span className="logo-highlight">BOX</span></span>
          </div>
          <p className="login-subtitle">Sistema de Gestión de Gimnasio</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="form-input"
              required
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="form-input"
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          {error && (
            <div className="alert alert-error">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary btn-login" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUser} /> Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const AuthenticatedApp = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('fitbox_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-client" element={<RegisterClient />} />
          <Route path="/register-payment" element={<RegisterPayment />} />
          <Route path="/search-client" element={<SearchClient />} />
          <Route path="/list-clients" element={<ListClients />} />
          <Route path="/client/:id" element={<ClientDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Controlar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('fitbox_token');
    onLogout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const toggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMenuOpen(!menuOpen);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.nav-main') && !e.target.closest('.mobile-menu-btn')) {
        setMenuOpen(false);
      }
    };

    // Cerrar menú al presionar ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => handleNavigation('/')}>
          <FontAwesomeIcon icon={faIdCard} className="logo-icon" />
          <span className="logo-text">FIT<span className="logo-highlight">BOX</span></span>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          type="button"
          aria-expanded={menuOpen}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <nav className={`nav-main ${menuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <button className="nav-link" onClick={() => handleNavigation('/')}>
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
            <button className="nav-link" onClick={() => handleNavigation('/register-client')}>
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
            </button>
            <button className="nav-link" onClick={() => handleNavigation('/register-payment')}>
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
            <button className="nav-link" onClick={() => handleNavigation('/search-client')}>
              <FontAwesomeIcon icon={faSearch} /> Buscar Cliente
            </button>
            <button className="nav-link" onClick={() => handleNavigation('/list-clients')}>
              <FontAwesomeIcon icon={faUsers} /> Lista de Clientes
            </button>
          </div>
          
          <button onClick={handleLogout} className="btn btn-logout">
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
          </button>
        </nav>

        {/* Overlay para móvil */}
        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} FitBox - Sistema de Gestión de Gimnasio</p>
        <p className="footer-version">v2.0.0</p>
      </div>
    </footer>
  );
};

const Home = () => (
  <div className="section fade-in">
    <div className="container">
      <div className="card home-card">
        <div className="home-header text-center">
          <h1 className="text-gradient">Bienvenido a FitBox</h1>
          <p className="lead text-muted">
            Gestión inteligente para tu gimnasio - Simple, Rápido y Eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md-grid-cols-3 gap-lg mt-xl">
          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3>Gestión de Clientes</h3>
            <p>Administra toda la información de tus socios de manera organizada y segura</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <h3>Control de Pagos</h3>
            <p>Seguimiento detallado de transacciones y estado de cuotas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3>Reportes Avanzados</h3>
            <p>Métricas y análisis para optimizar tu negocio</p>
          </div>
        </div>

        <div className="quick-stats grid grid-cols-1 md-grid-cols-3 gap-md mt-xl">
          <div className="stat-card">
            <FontAwesomeIcon icon={faUsers} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">150+</span>
              <span className="stat-label">Clientes Activos</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faMoneyBillWave} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">98%</span>
              <span className="stat-label">Pagos al Día</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faStar} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">Satisfacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
        text: 'Error de conexión con el servidor',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section fade-in">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-back"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="card-title">
              <FontAwesomeIcon icon={faUserPlus} className="icon-title" />
              Registrar Nuevo Cliente
            </h2>
          </div>

          <div className="card-body">
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.type === 'success' ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} /> Nombre: *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input"
                    required
                    maxLength="50"
                    placeholder="Ingresa el nombre"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} /> Apellido: *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="form-input"
                    required
                    maxLength="50"
                    placeholder="Ingresa el apellido"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faIdCard} /> DNI: *
                  </label>
                  <input
                    type="text"
                    name="DNI"
                    value={formData.DNI}
                    onChange={handleChange}
                    className="form-input"
                    required
                    pattern="[0-9]{7,8}"
                    title="El DNI debe contener 7 u 8 números"
                    placeholder="Número de DNI"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faHeartbeat} /> Lesiones/Enfermedades:
                  </label>
                  <input
                    type="text"
                    name="lesiones"
                    value={formData.lesiones}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Opcional - Ej: Lesión de rodilla"
                    maxLength="100"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="form-label checkbox-label">
                    <input
                      type="checkbox"
                      name="es_menor"
                      checked={formData.es_menor}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="checkmark"></span>
                    ¿Es menor de edad?
                  </label>
                </div>

                {formData.es_menor && (
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faPhone} /> Teléfono del tutor:
                    </label>
                    <input
                      type="tel"
                      name="telefono_tutor"
                      value={formData.telefono_tutor}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Número de contacto del tutor"
                      pattern="[0-9]{10,15}"
                      title="Número de teléfono válido (10-15 dígitos)"
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
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
                  className="btn btn-secondary btn-lg"
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

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePartialPaymentChange = (index, e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newPagos = [...prev.pagos_parciales];
      newPagos[index] = {
        ...newPagos[index],
        [name]: value
      };
      
      return {
        ...prev,
        pagos_parciales: newPagos
      };
    });
  };

  const addPartialPayment = () => {
    setFormData(prev => ({
      ...prev,
      pagos_parciales: [
        ...prev.pagos_parciales,
        { monto: '', metodo_pago: 'efectivo' }
      ]
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
        text: `✅ Pago registrado! Saldo pendiente: $${data.saldo_pendiente || '0.00'}`,
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
        text: `❌ Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="card text-center p-5">
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              <p className="mt-3">Cargando datos de clientes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-back"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="card-title">
              <FontAwesomeIcon icon={faMoneyBillWave} className="icon-title" />
              Registrar Pago
            </h2>
          </div>

          <div className="card-body">
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.type === 'success' ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Cliente: *</label>
                  <select
                    name="id_persona"
                    value={formData.id_persona}
                    onChange={handleChange}
                    className="form-select"
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

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faCalendarDay} /> Fecha de Pago: *
                  </label>
                  <input
                    type="date"
                    name="fecha_pago"
                    value={formData.fecha_pago}
                    onChange={handleChange}
                    className="form-input"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faDollarSign} /> Monto Total (ARS): *
                  </label>
                  <input
                    type="number"
                    name="monto_total"
                    value={formData.monto_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                    placeholder="Ingresa el monto"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="form-label checkbox-label">
                    <input
                      type="checkbox"
                      checked={showPartialPayments}
                      onChange={() => setShowPartialPayments(!showPartialPayments)}
                      className="form-checkbox"
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    ¿Pago parcial/múltiples métodos?
                  </label>
                </div>
              </div>

              {showPartialPayments ? (
                <div className="partial-payments-container">
                  <h4 className="partial-payments-title">
                    <FontAwesomeIcon icon={faWallet} /> Pagos Parciales
                  </h4>
                  {formData.pagos_parciales.map((pago, index) => (
                    <div key={index} className="partial-payment-group">
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Monto: *</label>
                          <input
                            type="number"
                            name="monto"
                            value={pago.monto}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            min="0"
                            step="0.01"
                            className="form-input"
                            required
                            disabled={isSubmitting}
                            placeholder="Monto parcial"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Método: *</label>
                          <select
                            name="metodo_pago"
                            value={pago.metodo_pago}
                            onChange={(e) => handlePartialPaymentChange(index, e)}
                            className="form-select"
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
                          className="btn btn-danger btn-sm"
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
                    className="btn btn-secondary btn-sm"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Agregar otro pago
                  </button>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Método de Pago: *</label>
                  <select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
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
                  className="btn btn-secondary btn-lg"
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

  const handleViewDetails = (id) => {
    navigate(`/client/${id}`);
  };

  return (
    <div className="section fade-in">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-back"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="card-title">
              <FontAwesomeIcon icon={faSearch} className="icon-title" />
              Buscar Cliente
            </h2>
          </div>

          <div className="card-body">
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.type === 'success' ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : message.type === 'error' ? (
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                ) : (
                  <FontAwesomeIcon icon={faInfoCircle} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <div className="search-input-group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    placeholder="Buscar por nombre, apellido o DNI..."
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !searchTerm.trim()}
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faSearch} />
                    )}
                    <span className="btn-text">Buscar</span>
                  </button>
                </div>
              </div>
            </form>

            {loading ? (
              <div className="text-center loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Buscando clientes...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="results-container">
                <h3 className="results-title">Resultados de la búsqueda</h3>
                <div className="client-grid">
                  {results.map(client => (
                    <div key={client.id_persona} className="client-card">
                      <div className="client-header">
                        <h3 className="client-name">{client.nombre_completo}</h3>
                      </div>
                      <div className="client-details">
                        <div className="client-detail">
                          <FontAwesomeIcon icon={faIdCard} />
                          <span>DNI: {client.DNI}</span>
                        </div>
                        <div className="client-detail">
                          <FontAwesomeIcon icon={faCalendarDay} />
                          <span>Último pago: {client.ultimo_pago || 'Nunca'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(client.id_persona)}
                        className="btn btn-primary btn-block"
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver detalles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchTerm && !loading && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faUsers} size="3x" />
                <p>No se encontraron clientes</p>
                <small>Intenta con otros términos de búsqueda</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    if (!status) return <span className="badge">Sin estado</span>;
    if (status.startsWith('DEBE:')) return <span className="badge badge-warning">{status}</span>;
    switch (status) {
      case 'Al día': return <span className="badge badge-success">{status}</span>;
      case 'Vencido': return <span className="badge badge-danger">{status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) return (
    <div className="section">
      <div className="container">
        <div className="card text-center p-4">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p className="mt-2">Cargando clientes...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="section">
      <div className="container">
        <div className="card">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchClients}>
              <FontAwesomeIcon icon={faRefresh} /> Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="section fade-in">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="header-content">
              <h2 className="card-title">
                <FontAwesomeIcon icon={faUsers} className="icon-title" />
                Lista de Clientes
              </h2>
              <div className="header-actions">
                <div className="search-box">
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar clientes..."
                  />
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/register-client')}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Nuevo Cliente
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="list-header">
              <p className="results-count">
                Mostrando {filteredClients.length} de {clients.length} clientes
              </p>
            </div>

            {filteredClients.length === 0 ? (
              <div className="empty-state">
                {searchTerm ? (
                  <>
                    <FontAwesomeIcon icon={faSearch} size="3x" />
                    <h3>No se encontraron resultados</h3>
                    <p>No hay clientes que coincidan con "{searchTerm}"</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSearchTerm('')}
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUsers} size="3x" />
                    <h3>No hay clientes registrados</h3>
                    <p>Comienza agregando tu primer cliente al sistema</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/register-client')}
                    >
                      <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="client-grid">
                {filteredClients.map(client => (
                  <div key={client.id_persona} className="client-card">
                    <div className="client-header">
                      <div>
                        <h3 className="client-name">{client.nombre_completo || `${client.nombre} ${client.apellido}`}</h3>
                        <div className="client-badges">
                          {getStatusBadge(client.estado_pago)}
                        </div>
                      </div>
                    </div>
                    <div className="client-details">
                      <div className="client-detail">
                        <FontAwesomeIcon icon={faIdCard} />
                        <span>DNI: {client.DNI || 'N/A'}</span>
                      </div>
                      <div className="client-detail">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>Total pagado: ${client.total_pagado?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="client-detail">
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>Registro: {new Date(client.fecha_registro).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/client/${client.id_persona}`)}
                      className="btn btn-primary btn-block"
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
      <div className="section">
        <div className="container">
          <div className="card text-center p-4">
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              <p className="mt-2">Cargando detalles del cliente...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="card">
            <div className="alert alert-danger">
              <h4>Error</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
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
      <div className="section">
        <div className="container">
          <div className="card">
            <div className="alert alert-warning">
              <h4>Cliente no encontrado</h4>
              <button 
                className="btn btn-primary"
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
    <div className="section fade-in">
      <div className="container">
        <div className="card">
          <div className="card-header responsive-header">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-back"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h2 className="card-title responsive-title">
              <FontAwesomeIcon icon={faUser} className="icon-title" />
              {client.nombre} {client.apellido}
            </h2>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register-payment', { state: { clientId: id } })}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
          </div>

          <div className="card-body">
            <div className="client-profile">
              <div className="client-info-section">
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faIdCard} /> Información Personal
                </h3>
                <div className="info-grid responsive-grid">
                  <div className="info-item">
                    <label>DNI:</label>
                    <p>{client.DNI}</p>
                  </div>
                  <div className="info-item">
                    <label>Fecha de registro:</label>
                    <p>{new Date(client.fecha_registro).toLocaleDateString()}</p>
                  </div>
                  {client.telefono_tutor && (
                    <div className="info-item">
                      <label>Teléfono tutor:</label>
                      <p>{client.telefono_tutor}</p>
                    </div>
                  )}
                  <div className="info-item full-width">
                    <label>Lesiones/Enfermedades:</label>
                    <p>{client.lesiones || 'Ninguna registrada'}</p>
                  </div>
                </div>
              </div>

              <div className="payments-section">
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faMoneyBillWave} /> Historial de Pagos
                </h3>
                
                {payments.length === 0 ? (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faMoneyBillWave} size="2x" />
                    <p>No hay registros de pago</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/register-payment', { state: { clientId: id } })}
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Primer Pago
                    </button>
                  </div>
                ) : (
                  <div className="payment-timeline">
                    {payments.map((payment, index) => (
                      <div key={index} className="payment-item responsive-payment">
                        <div className="payment-header responsive-payment-header">
                          <h4 className="payment-month">{payment.mes_pagado}</h4>
                          <span className="payment-date">{payment.fecha}</span>
                        </div>
                        <div className="payment-details responsive-payment-details">
                          <div className="payment-detail">
                            <label>Total:</label>
                            <span className="payment-amount">${payment.monto_total.toFixed(2)}</span>
                          </div>
                          <div className="payment-detail">
                            <label>Pagado:</label>
                            <span className="payment-amount paid">${payment.monto_pagado.toFixed(2)}</span>
                          </div>
                          <div className="payment-detail">
                            <label>Saldo:</label>
                            <span className={`payment-amount ${payment.saldo_pendiente > 0 ? 'pending' : 'paid'}`}>
                              ${payment.saldo_pendiente.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {payment.detalle_pagos?.length > 0 && (
                          <div className="partial-payments">
                            <h5>Detalles de pago:</h5>
                            <ul>
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

export default App;
