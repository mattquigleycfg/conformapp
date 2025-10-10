import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDropbox, refreshAccessToken, isTokenExpired } from '../utils/dropbox';

interface UseDropboxAuthResult {
  isAuthenticated: boolean;
  login: () => void;
  handleCallback: (code: string) => Promise<void>;
  logout: () => void;
}

export const useDropboxAuth = (): UseDropboxAuthResult => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('dropbox_token');
      const tokenDataStr = localStorage.getItem('dropbox_token_data');
      
      if (token && tokenDataStr) {
        try {
          const tokenData = JSON.parse(tokenDataStr);
          
          // Check if token is expired and refresh if needed
          if (isTokenExpired()) {
            try {
              await refreshAccessToken();
              console.log('Token refreshed successfully');
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // Clear invalid tokens
              localStorage.removeItem('dropbox_token');
              localStorage.removeItem('dropbox_token_data');
              return;
            }
          }
          
          // Initialize with current token
          initializeDropbox(token, tokenData.refreshToken, tokenData.expiresAt);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to initialize Dropbox:', error);
          localStorage.removeItem('dropbox_token');
          localStorage.removeItem('dropbox_token_data');
        }
      }
    };

    initializeAuth();
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
    
    // Use authorization code flow for refresh tokens
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${
      import.meta.env.VITE_DROPBOX_APP_KEY
    }&response_type=code&redirect_uri=${
      encodeURIComponent(redirectUri)
    }&scope=${
      encodeURIComponent(scopes)
    }&token_access_type=offline`;
    
    window.location.href = authUrl;
  }, []);

  const handleCallback = async (code: string) => {
    try {
      // Exchange authorization code for tokens
      const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_DROPBOX_APP_KEY,
          client_secret: import.meta.env.VITE_DROPBOX_APP_SECRET,
          redirect_uri: `${window.location.origin}/auth/callback`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('dropbox_token', data.access_token);
      initializeDropbox(data.access_token, data.refresh_token, data.expires_in);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to handle callback:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('dropbox_token');
    localStorage.removeItem('dropbox_token_data');
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