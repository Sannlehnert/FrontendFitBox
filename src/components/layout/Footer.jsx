const Footer = () => {
  return (
    <footer className="no-print bg-black/90 border-t border-secondary/10 py-6 text-center text-gray-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} FitBox - Sistema de Gestion de Gimnasio</p>
        <p className="mt-1 text-xs opacity-70">v2.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
