import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faMoneyBillWave, faChartLine, faStar
} from '@fortawesome/free-solid-svg-icons';

const Home = () => (
  <div className="py-6 fade-in">
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-gradient-card backdrop-blur-lg border border-secondary/10 rounded-2xl shadow-2xl relative overflow-hidden card-gold-line text-center hover:-translate-y-1 hover:shadow-3xl hover:border-secondary/20 transition-all duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-gradient text-4xl md:text-5xl font-extrabold mb-4">Bienvenido a FitBox</h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Gestion inteligente para tu gimnasio - Simple, Rapido y Eficiente
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="feature-hover bg-gradient-card border border-secondary/10 rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/20">
              <div className="text-5xl text-secondary mb-6 transition-all duration-300 group-hover:scale-110">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gestion de Clientes</h3>
              <p className="text-gray-300 leading-relaxed">Administra toda la informacion de tus socios de manera organizada y segura</p>
            </div>

            <div className="feature-hover bg-gradient-card border border-secondary/10 rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/20">
              <div className="text-5xl text-secondary mb-6">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Control de Pagos</h3>
              <p className="text-gray-300 leading-relaxed">Seguimiento detallado de transacciones y estado de cuotas</p>
            </div>

            <div className="feature-hover bg-gradient-card border border-secondary/10 rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/20">
              <div className="text-5xl text-secondary mb-6">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reportes Avanzados</h3>
              <p className="text-gray-300 leading-relaxed">Metricas y analisis para optimizar tu negocio</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="flex items-center gap-4 p-6 bg-secondary/[0.08] border border-secondary/10 rounded-2xl transition-all duration-300 hover:bg-secondary/[0.12] hover:border-secondary/20 hover:-translate-y-1">
              <FontAwesomeIcon icon={faUsers} className="text-4xl text-secondary" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white leading-none">150+</span>
                <span className="text-sm text-gray-400 mt-1">Clientes Activos</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-secondary/[0.08] border border-secondary/10 rounded-2xl transition-all duration-300 hover:bg-secondary/[0.12] hover:border-secondary/20 hover:-translate-y-1">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-4xl text-secondary" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white leading-none">98%</span>
                <span className="text-sm text-gray-400 mt-1">Pagos al Dia</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-secondary/[0.08] border border-secondary/10 rounded-2xl transition-all duration-300 hover:bg-secondary/[0.12] hover:border-secondary/20 hover:-translate-y-1">
              <FontAwesomeIcon icon={faStar} className="text-4xl text-secondary" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white leading-none">4.9/5</span>
                <span className="text-sm text-gray-400 mt-1">Satisfaccion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
