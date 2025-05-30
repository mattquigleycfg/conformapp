import React, { useRef, useState } from 'react';
import { Upload, FileX, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadFile } from '../utils/dropbox';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  folder: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, folder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'error' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      setUploadStatus('uploading');
      try {
        const path = `/${folder}/${file.name}`;
        await uploadFile(file, path);
        onFileUpload(file);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 2000);
      }
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }
  };

  return (
    <motion.div 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : uploadStatus === 'error'
          ? 'border-red-500 bg-red-50'
          : uploadStatus === 'success'
          ? 'border-green-500 bg-green-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center space-y-3">
        {uploadStatus === 'idle' && (
          <>
            <Upload size={36} className="text-gray-400" />
            <p className="text-lg font-medium text-gray-700">
              Drop your PDF file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF files only
            </p>
          </>
        )}
        
        {uploadStatus === 'uploading' && (
          <>
            <Loader2 size={36} className="text-blue-500 animate-spin" />
            <p className="text-lg font-medium text-blue-700">
              Uploading file...
            </p>
          </>
        )}
        
        {uploadStatus === 'error' && (
          <>
            <FileX size={36} className="text-red-500" />
            <p className="text-lg font-medium text-red-700">
              Invalid file format
            </p>
            <p className="text-sm text-red-500">
              Please upload a PDF file
            </p>
          </>
        )}
        
        {uploadStatus === 'success' && (
          <>
            <Check size={36} className="text-green-500" />
            <p className="text-lg font-medium text-green-700">
              File uploaded successfully
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FileUploader;