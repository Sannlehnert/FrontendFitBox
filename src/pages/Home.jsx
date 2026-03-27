// src/pages/Home.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMoneyBillWave, faChartLine, faStar } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-card backdrop-blur border border-gold/10 rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="p-6 border-b border-gold/10 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent mb-3">
              Bienvenido a FitBox
            </h1>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              Gestión inteligente para tu gimnasio - Simple, Rápido y Eficiente
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-card border border-gold/10 rounded-xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <FontAwesomeIcon icon={faUsers} className="text-secondary text-5xl mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all" />
                <h3 className="text-xl font-bold text-white mb-2">Gestión de Clientes</h3>
                <p className="text-text-secondary">Administra toda la información de tus socios de manera organizada y segura</p>
              </div>
              <div className="bg-gradient-card border border-gold/10 rounded-xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-secondary text-5xl mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all" />
                <h3 className="text-xl font-bold text-white mb-2">Control de Pagos</h3>
                <p className="text-text-secondary">Seguimiento detallado de transacciones y estado de cuotas</p>
              </div>
              <div className="bg-gradient-card border border-gold/10 rounded-xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <FontAwesomeIcon icon={faChartLine} className="text-secondary text-5xl mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all" />
                <h3 className="text-xl font-bold text-white mb-2">Reportes Avanzados</h3>
                <p className="text-text-secondary">Métricas y análisis para optimizar tu negocio</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-5 bg-gold/5 border border-gold/10 rounded-xl hover:bg-gold/10 hover:-translate-y-1 transition-all">
                <FontAwesomeIcon icon={faUsers} className="text-secondary text-4xl" />
                <div>
                  <p className="text-2xl font-bold text-white">150+</p>
                  <p className="text-text-muted">Clientes Activos</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gold/5 border border-gold/10 rounded-xl hover:bg-gold/10 hover:-translate-y-1 transition-all">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-secondary text-4xl" />
                <div>
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-text-muted">Pagos al Día</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gold/5 border border-gold/10 rounded-xl hover:bg-gold/10 hover:-translate-y-1 transition-all">
                <FontAwesomeIcon icon={faStar} className="text-secondary text-4xl" />
                <div>
                  <p className="text-2xl font-bold text-white">4.9/5</p>
                  <p className="text-text-muted">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;