import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { useOdoo } from '../hooks/useOdoo';

const OdooIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { connect, uploadBOM, createWorkOrder } = useOdoo();

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await connect();
      setIsConnected(true);
      setSuccess('Successfully connected to Odoo');
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(file, {
          complete: resolve,
          error: reject,
          header: true,
          skipEmptyLines: true
        });
      });

      if (result.errors.length > 0) {
        throw new Error('Invalid CSV format');
      }

      const bomId = await uploadBOM(result.data);
      await createWorkOrder(bomId);

      setSuccess('BOM uploaded and work order created successfully');
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Not connected')) {
        setIsConnected(false);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-gray-800">Odoo Integration</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Status:</span>
          {isConnected ? (
            <span className="flex items-center text-green-600">
              <CheckCircle size={16} className="mr-1" />
              Connected
            </span>
          ) : (
            <span className="flex items-center text-gray-600">
              <XCircle size={16} className="mr-1" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {!isConnected ? (
        <motion.button
          className={`w-full py-3 px-4 ${
            isConnecting 
              ? 'bg-[#8B6683] cursor-not-allowed' 
              : 'bg-[#714B67] hover:bg-[#5D3D54]'
          } text-white rounded-lg font-medium transition-colors flex items-center justify-center`}
          onClick={handleConnect}
          disabled={isConnecting}
          whileTap={{ scale: 0.98 }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Connecting...
            </>
          ) : (
            'Connect to Odoo'
          )}
        </motion.button>
      ) : (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload BOM CSV'}</span>
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Upload a CSV file containing the Bill of Materials
            </p>
          </div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default OdooIntegration;