import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faUserPlus, faMoneyBillWave, faSearch, faUsers,
  faIdCard, faBars, faTimes, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.nav-main') && !e.target.closest('.mobile-menu-btn')) {
        setMenuOpen(false);
      }
    };
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

  const navItems = [
    { path: '/', icon: faHome, label: 'Inicio' },
    { path: '/register-client', icon: faUserPlus, label: 'Registrar Cliente' },
    { path: '/register-payment', icon: faMoneyBillWave, label: 'Registrar Pago' },
    { path: '/search-client', icon: faSearch, label: 'Buscar Cliente' },
    { path: '/list-clients', icon: faUsers, label: 'Lista de Clientes' },
  ];

  return (
    <header className="no-print bg-black/95 backdrop-blur-xl border-b border-secondary/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[70px] relative">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
          onClick={() => handleNavigation('/')}
        >
          <FontAwesomeIcon
            icon={faIdCard}
            className="text-secondary text-3xl transition-all duration-300 hover:scale-110 hover:rotate-[5deg]"
          />
          <span className="text-2xl font-extrabold text-gradient tracking-tight">
            FIT<span className="text-secondary">BOX</span>
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn hidden md:hidden bg-secondary/10 border border-secondary/20 text-secondary w-11 h-11 rounded-xl items-center justify-center cursor-pointer z-[1002] relative transition-all duration-300 hover:bg-secondary/20 hover:scale-105"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          type="button"
          aria-expanded={menuOpen}
          style={{ display: undefined }}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Navigation */}
        <nav className={`nav-main flex items-center gap-2 md:flex
          max-md:fixed max-md:inset-0 max-md:bg-black/[0.98] max-md:backdrop-blur-3xl max-md:flex-col max-md:p-8 max-md:z-[999] max-md:overflow-y-auto max-md:justify-center max-md:items-center max-md:w-full max-md:h-screen max-md:transition-all max-md:duration-400
          ${menuOpen ? 'max-md:translate-x-0 max-md:opacity-100' : 'max-md:-translate-x-full max-md:opacity-0'}
        `}>
          <div className="flex gap-2 max-md:flex-col max-md:w-full max-md:max-w-[400px] max-md:gap-3 max-md:mb-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                className="nav-link-effect flex items-center gap-2 px-5 py-3 text-gray-300 font-semibold text-sm rounded-full bg-white/5 cursor-pointer border-none font-[inherit] transition-all duration-300 hover:text-secondary hover:-translate-y-0.5 hover:shadow-lg
                  max-md:w-full max-md:justify-start max-md:bg-white/[0.08] max-md:border max-md:border-secondary/20 max-md:px-6 max-md:py-5 max-md:rounded-2xl max-md:text-lg max-md:hover:translate-x-2.5 max-md:hover:bg-secondary/15"
                onClick={() => handleNavigation(item.path)}
              >
                <FontAwesomeIcon icon={item.icon} /> {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="bg-error/10 border-none text-error px-5 py-3 rounded-full flex items-center gap-2 font-semibold cursor-pointer text-sm font-[inherit] transition-all duration-300 hover:bg-error/20 hover:-translate-y-0.5
              max-md:w-full max-md:max-w-[400px] max-md:justify-center max-md:mt-6 max-md:px-6 max-md:py-5 max-md:text-lg"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesion
          </button>
        </nav>

        {/* Mobile overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[998] md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Header;
