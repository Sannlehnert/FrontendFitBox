import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faHome, faUserPlus, faMoneyBillWave, faSearch, faUsers, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.mobile-menu-panel') && !e.target.closest('.mobile-menu-btn')) {
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
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between">
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
          className="md:hidden flex items-center justify-center w-11 h-11 bg-gold/10 border border-gold/20 rounded-xl text-secondary hover:bg-gold/20 hover:scale-105 transition-all"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>

        {/* Menú desktop (oculto en móvil) */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => handleNavigation('/')} className="nav-link flex items-center gap-2 px-4 py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all">
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
            <button onClick={() => handleNavigation('/register-client')} className="nav-link flex items-center gap-2 px-4 py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all">
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
            </button>
            <button onClick={() => handleNavigation('/register-payment')} className="nav-link flex items-center gap-2 px-4 py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
            <button onClick={() => handleNavigation('/search-client')} className="nav-link flex items-center gap-2 px-4 py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all">
              <FontAwesomeIcon icon={faSearch} /> Buscar Cliente
            </button>
            <button onClick={() => handleNavigation('/list-clients')} className="nav-link flex items-center gap-2 px-4 py-2 text-text-secondary font-semibold rounded-full hover:bg-gold/10 hover:text-secondary hover:-translate-y-0.5 transition-all">
              <FontAwesomeIcon icon={faUsers} /> Lista de Clientes
            </button>
          </div>
          <button onClick={handleLogout} className="ml-2 flex items-center gap-2 px-5 py-2 bg-error/10 border border-error/20 text-error font-semibold rounded-full hover:bg-error/20 hover:-translate-y-0.5 transition-all">
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
          </button>
        </nav>

        {/* Menú móvil (panel lateral) */}
        <div
          className={`
            fixed top-0 right-0 bottom-0 w-[280px] max-w-full bg-black/95 backdrop-blur-2xl
            flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out z-[1001]
            mobile-menu-panel
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
            md:hidden
          `}
        >
          <div className="flex justify-end mb-6">
            <button onClick={toggleMenu} className="text-secondary text-2xl p-2">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary transition-all">
              <FontAwesomeIcon icon={faHome} /> Inicio
            </button>
            <button onClick={() => handleNavigation('/register-client')} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary transition-all">
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Cliente
            </button>
            <button onClick={() => handleNavigation('/register-payment')} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary transition-all">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Registrar Pago
            </button>
            <button onClick={() => handleNavigation('/search-client')} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary transition-all">
              <FontAwesomeIcon icon={faSearch} /> Buscar Cliente
            </button>
            <button onClick={() => handleNavigation('/list-clients')} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-text-secondary font-semibold hover:bg-gold/10 hover:text-secondary transition-all">
              <FontAwesomeIcon icon={faUsers} /> Lista de Clientes
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 bg-error/10 rounded-xl text-error font-semibold hover:bg-error/20 transition-all">
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Overlay cuando menú abierto */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[1000] md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;