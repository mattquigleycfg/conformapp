import { Dropbox } from 'dropbox';

const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
const SHARED_FOLDER_URL = 'https://www.dropbox.com/scl/fo/p9tn35qfgj55g5i20jzhu/h';

if (!DROPBOX_APP_KEY) {
  throw new Error('Missing Dropbox App Key');
}

let dropbox = new Dropbox({
  clientId: DROPBOX_APP_KEY
});

export const initializeDropbox = (accessToken: string) => {
  dropbox = new Dropbox({
    accessToken,
    clientId: DROPBOX_APP_KEY
  });
};

export const listFolders = async () => {
  try {
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