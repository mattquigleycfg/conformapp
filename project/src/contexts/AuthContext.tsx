import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDropbox } from '../utils/dropbox';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  handleCallback: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('dropbox_token');
    if (token) {
      try {
        initializeDropbox(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to initialize Dropbox:', error);
        localStorage.removeItem('dropbox_token');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(() => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scopes = [
      'files.metadata.read',
      'files.metadata.write',
      'files.content.read',
      'files.content.write',
      'sharing.read',
      'sharing.write'
    ].join(' ');
    
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DROPBOX_APP_KEY
    }&response_type=token&redirect_uri=${
      encodeURIComponent(redirectUri)
    }&scope=${
      encodeURIComponent(scopes)
    }`;
    
    window.location.href = authUrl;
  }, []);

  const handleCallback = useCallback(async (token: string) => {
    try {
      localStorage.setItem('dropbox_token', token);
      initializeDropbox(token);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Failed to handle callback:', error);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_token');
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  }, [navigate]);

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, handleCallback, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

