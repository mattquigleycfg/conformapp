import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'
  : 'https://con-form-api.netlify.app/.netlify/functions/odoo-proxy';

interface OdooHook {
  connect: () => Promise<void>;
  uploadBOM: (data: any[]) => Promise<number>;
  createWorkOrder: (bomId: number) => Promise<void>;
}

export const useOdoo = (): OdooHook => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const connect = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/token`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check API permissions.');
      } else {
        throw new Error(`Failed to connect to Odoo: ${error.message}`);
      }
    }
  };

  const uploadBOM = async (data: any[]): Promise<number> => {
    if (!isAuthenticated) {
      throw new Error('Not connected to Odoo');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/bom/create`,
        { bom_line_ids: data },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.data.id) {
        throw new Error('Failed to create BOM');
      }

      return response.data.id;
    } catch (error: any) {
      throw new Error(`Failed to upload BOM: ${error.message}`);
    }
  };

  const createWorkOrder = async (bomId: number): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Not connected to Odoo');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/manufacturing/create`,
        {
          bom_id: bomId,
          product_qty: 1,
          state: 'draft'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to create work order');
      }
    } catch (error: any) {
      throw new Error(`Failed to create work order: ${error.message}`);
    }
  };

  return {
    connect,
    uploadBOM,
    createWorkOrder
  };
};