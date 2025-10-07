import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      const hash = location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        await handleCallback(accessToken);
      }
    };

    processAuth();
  }, [location, handleCallback]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback