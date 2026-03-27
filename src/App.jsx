import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isTokenValid } from './services/api';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import RegisterClient from './pages/RegisterClient';
import RegisterPayment from './pages/RegisterPayment';
import SearchClient from './pages/SearchClient';
import ListClients from './pages/ListClients';
import ClientDetail from './pages/ClientDetail';

function App() {
  return <AppRouter />;
}

const AuthenticatedApp = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('fitbox_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-dark relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-secondary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[80%] w-96 h-96 bg-secondary/[0.02] rounded-full blur-3xl" />
      </div>
      <Header onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full">
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

AuthenticatedApp.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

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

export default App;
