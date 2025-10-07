import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthCallback from './pages/AuthCallback';
import Calculator from './pages/Calculator';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/*" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/calculator/*" element={isAuthenticated ? <Calculator /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;