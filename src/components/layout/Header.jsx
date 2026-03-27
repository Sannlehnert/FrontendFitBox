// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faHome, faUserPlus, faMoneyBillWave, faSearch, faUsers, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
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
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.nav-main') && !e.target.closest('.mobile-menu-btn')) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gold/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between relative">
        {/* Logo */}
        <div
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 transition-all"
        >
          <FontAwesomeIcon icon={faIdCard} className="text-secondary text-[1.75rem] drop-shadow-glow-sm hover:scale-110 hover:rotate-5 transition-all" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent tracking-tight">
            FIT<span className="text-secondary">BOX</span>
          </span>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-11 h-11 bg-gold/10 border border-gold/20 rounded-xl text-secondary hover:bg-gold/20 hover:scale-105 transition-all z-[1002]"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Navegación desktop/mobile */}
        <nav
          className={`
            fixed md:static top-0 left-0 right-0 bottom-0 bg-black/98 backdrop-blur-3xl
            flex flex-col md:flex-row items-center justify-center md:justify-end
            transition-all duration-400 ease-in-out z-[999] md:z-auto
            ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}
            md:bg-transparent md:backdrop-blur-none md:flex-row md:relative md:translate-x-0 md:opacity-100
          `}
        >
          <div className="flex flex-col md:flex-row gap-3 md:gap-2 w-full max-w-sm md:max-w-none">
            <button
              onClick={() => handleNavigation('/')}
              className="nav-link flex items-center gap-2 px-4 py-3 md:py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all text-left md:text-center"
            >
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
            <button
              onClick={() => handleNavigation('/register-client')}
              className="nav-link flex items-center gap-2 px-4 py-3 md:py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
            </button>
            <button
              onClick={() => handleNavigation('/register-payment')}
              className="nav-link flex items-center gap-2 px-4 py-3 md:py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
            <button
              onClick={() => handleNavigation('/search-client')}
              className="nav-link flex items-center gap-2 px-4 py-3 md:py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faSearch} /> Buscar Cliente
            </button>
            <button
              onClick={() => handleNavigation('/list-clients')}
              className="nav-link flex items-center gap-2 px-4 py-3 md:py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faUsers} /> Lista de Clientes
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 md:ml-2 flex items-center justify-center gap-2 px-5 py-3 bg-error/10 border border-error/20 text-error font-semibold rounded-full hover:bg-error/20 hover:-translate-y-0.5 transition-all w-full max-w-sm md:w-auto"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
          </button>
        </nav>

        {/* Overlay móvil */}
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

export default Header;