import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from '../components/LoginButton';

const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-12 text-center">
          <div>
            <img 
              src="/Cf Logo Favicon 2022 500px.png"
              alt="Con-form Group"
              className="mx-auto h-32"
            />
          </div>
          <LoginButton onLogin={login} />
          <div className="mt-4 text-sm text-gray-600">Use Con-form Group email address</div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;