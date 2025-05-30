import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDropbox } from '../utils/dropbox';

interface UseDropboxAuthResult {
  isAuthenticated: boolean;
  login: () => void;
  handleCallback: (token: string) => Promise<void>;
  logout: () => void;
}

export const useDropboxAuth = (): UseDropboxAuthResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('dropbox_token');
    if (token) {
      initializeDropbox(token);
      setIsAuthenticated(true);
    }
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

  const handleCallback = async (token: string) => {
    try {
      localStorage.setItem('dropbox_token', token);
      initializeDropbox(token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to handle callback:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_token');
    setIsAuthenticated(false);
    navigate('/');
  }, [navigate]);

  return {
    isAuthenticated,
    login,
    handleCallback,
    logout,
  };
};