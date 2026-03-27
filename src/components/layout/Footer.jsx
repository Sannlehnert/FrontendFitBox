// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-gold/10 py-6 text-center text-text-muted text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} FitBox - Sistema de Gestión de Gimnasio</p>
        <p className="text-xs opacity-70 mt-1">v2.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;