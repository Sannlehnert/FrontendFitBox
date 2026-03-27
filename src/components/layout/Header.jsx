import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faHome, faUserPlus, faMoneyBillWave, faSearch, faUsers, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('fitbox_token');
    onLogout();
    navigate('/');
    setMenuOpen(false);
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

  // Cerrar menú al hacer clic fuera (solo si el menú está abierto)
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
          <FontAwesomeIcon icon={faIdCard} className="text-secondary text-[1.75rem] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:scale-110 hover:rotate-5 transition-all" />
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
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>

        {/* Navegación desktop/mobile */}
        <nav
          className={`
            fixed top-0 left-0 right-0 bottom-0
            md:static md:flex-row md:items-center md:justify-end md:bg-transparent md:backdrop-blur-none
            flex flex-col items-center justify-center
            transition-all duration-300 ease-in-out
            z-[1000]
            ${menuOpen 
              ? 'opacity-100 visible translate-x-0' 
              : 'opacity-0 invisible translate-x-full md:opacity-100 md:visible md:translate-x-0'
            }
          `}
          style={{
            background: menuOpen ? 'rgba(0,0,0,0.98)' : 'transparent',
            backdropFilter: menuOpen ? 'blur(30px)' : 'none',
          }}
        >
          <div className="flex flex-col md:flex-row gap-3 md:gap-2 w-full max-w-sm md:max-w-none px-4 md:px-0">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center justify-start md:justify-center gap-2 px-5 py-3 md:py-2 bg-white/5 md:bg-transparent border border-gold/20 md:border-0 rounded-xl md:rounded-full text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
            <button
              onClick={() => handleNavigation('/register-client')}
              className="flex items-center justify-start md:justify-center gap-2 px-5 py-3 md:py-2 bg-white/5 md:bg-transparent border border-gold/20 md:border-0 rounded-xl md:rounded-full text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
            </button>
            <button
              onClick={() => handleNavigation('/register-payment')}
              className="flex items-center justify-start md:justify-center gap-2 px-5 py-3 md:py-2 bg-white/5 md:bg-transparent border border-gold/20 md:border-0 rounded-xl md:rounded-full text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
            <button
              onClick={() => handleNavigation('/search-client')}
              className="flex items-center justify-start md:justify-center gap-2 px-5 py-3 md:py-2 bg-white/5 md:bg-transparent border border-gold/20 md:border-0 rounded-xl md:rounded-full text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faSearch} /> Buscar Cliente
            </button>
            <button
              onClick={() => handleNavigation('/list-clients')}
              className="flex items-center justify-start md:justify-center gap-2 px-5 py-3 md:py-2 bg-white/5 md:bg-transparent border border-gold/20 md:border-0 rounded-xl md:rounded-full text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all"
            >
              <FontAwesomeIcon icon={faUsers} /> Lista de Clientes
            </button>
            <button
              onClick={handleLogout}
              className="mt-2 md:mt-0 md:ml-2 flex items-center justify-center gap-2 px-5 py-3 bg-error/10 border border-error/20 text-error font-semibold rounded-xl md:rounded-full hover:bg-error/20 hover:-translate-y-0.5 transition-all w-full md:w-auto"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </div>
        </nav>

        {/* Overlay para móvil cuando el menú está abierto */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[999] md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;