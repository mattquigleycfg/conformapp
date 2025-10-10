import { Dropbox } from 'dropbox';

const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;
const SHARED_FOLDER_URL = 'https://www.dropbox.com/scl/fo/p9tn35qfgj55g5i20jzhu/h';

if (!DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
  throw new Error('Missing Dropbox App Key or Secret');
}

let dropbox = new Dropbox({
  clientId: DROPBOX_APP_KEY
});

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const initializeDropbox = (accessToken: string, refreshToken?: string, expiresIn?: number) => {
  const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : Date.now() + (4 * 60 * 60 * 1000); // Default 4 hours
  
  // Store token data for refresh capability
  if (refreshToken) {
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt
    };
    localStorage.setItem('dropbox_token_data', JSON.stringify(tokenData));
  }

  dropbox = new Dropbox({
    accessToken,
    clientId: DROPBOX_APP_KEY
  });
};

export const refreshAccessToken = async (): Promise<{ accessToken: string; expiresIn: number }> => {
  const tokenDataStr = localStorage.getItem('dropbox_token_data');
  if (!tokenDataStr) {
    throw new Error('No refresh token available');
  }

  const tokenData: TokenData = JSON.parse(tokenDataStr);
  
  try {
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenData.refreshToken,
        client_id: DROPBOX_APP_KEY,
        client_secret: DROPBOX_APP_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update stored token data
    const newTokenData: TokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || tokenData.refreshToken, // Keep old refresh token if not provided
      expiresAt: Date.now() + (data.expires_in * 1000)
    };
    
    localStorage.setItem('dropbox_token_data', JSON.stringify(newTokenData));
    localStorage.setItem('dropbox_token', data.access_token);
    
    // Update Dropbox client
    dropbox = new Dropbox({
      accessToken: data.access_token,
      clientId: DROPBOX_APP_KEY
    });

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear invalid tokens
    localStorage.removeItem('dropbox_token');
    localStorage.removeItem('dropbox_token_data');
    throw error;
  }
};

export const isTokenExpired = (): boolean => {
  const tokenDataStr = localStorage.getItem('dropbox_token_data');
  if (!tokenDataStr) return true;
  
  const tokenData: TokenData = JSON.parse(tokenDataStr);
  return Date.now() >= tokenData.expiresAt - (5 * 60 * 1000); // Refresh 5 minutes before expiration
};

export const ensureValidToken = async (): Promise<void> => {
  if (isTokenExpired()) {
    await refreshAccessToken();
  }
};

export const listFolders = async () => {
  try {
    await ensureValidToken();
    const response = await dropbox.filesListFolder({
      path: '',
      shared_link: { url: SHARED_FOLDER_URL }
    });

    return response.result.entries
      .filter(entry => entry['.tag'] === 'folder')
      .map(folder => folder.name);
  } catch (error) {
    console.error('Error listing folders:', error);
    throw error;
  }
};

export const listFiles = async (folderPath?: string) => {
  try {
    await ensureValidToken();
    const path = folderPath ? `/${folderPath}` : '';
    const response = await dropbox.filesListFolder({
      path,
      recursive: false,
      shared_link: { url: SHARED_FOLDER_URL }
    });

    return response.result.entries.filter(entry => entry['.tag'] === 'file');
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

export const uploadFile = async (file: File, path: string) => {
  try {
    await ensureValidToken();
    const uploadResponse = await dropbox.filesUpload({
      path: `/${path}`,
      contents: file,
      mode: { '.tag': 'overwrite' },
      autorename: true,
      shared_link: { url: SHARED_FOLDER_URL }
    });
    
    return uploadResponse.result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFilePreview = async (path: string) => {
  try {
    await ensureValidToken();
    const fileResponse = await dropbox.filesGetTemporaryLink({
      path: `/${path}`,
      shared_link: { url: SHARED_FOLDER_URL }
    });
    
    return fileResponse.result.link;
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw error;
  }
};

export const searchFiles = async (query: string) => {
  try {
    await ensureValidToken();
    const searchResponse = await dropbox.filesSearchV2({
      query,
      options: {
        path: '',
        max_results: 100
      },
      match_field_options: {
        include_highlights: false
      },
      shared_link: { url: SHARED_FOLDER_URL }
    });
    
    return searchResponse.result.matches;
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
};