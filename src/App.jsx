// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import './styles/App.css';

function App() {
  return <AppRouter />;
}

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    const checkAuth = () => {
      const valid = isTokenValid();
      if (!valid && isAuthenticated) setIsAuthenticated(false);
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

const AuthenticatedApp = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('fitbox_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,0,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,215,0,0.02)_0%,transparent_50%)] z-[-1]" />
      <Header onLogout={handleLogout} />
      <main className="flex-1 py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
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

export default App;