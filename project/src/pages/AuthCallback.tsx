import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      // Check for authorization code in URL parameters (new flow)
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          await handleCallback(code);
        } catch (error) {
          console.error('Authentication failed:', error);
          // Redirect to login page on error
          window.location.href = '/';
        }
        return;
      }

      // Fallback: Check for access token in hash (old flow for backward compatibility)
      const hash = location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        try {
          // For backward compatibility, we'll still support the old flow
          // but we won't have refresh tokens
          await handleCallback(accessToken);
        } catch (error) {
          console.error('Authentication failed:', error);
          window.location.href = '/';
        }
      } else {
        // No valid auth parameters found, redirect to home
        window.location.href = '/';
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