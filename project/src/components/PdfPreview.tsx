import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PdfPreviewProps {
  pdfUrl: string;
  drawingId: string;
  onClose: () => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, drawingId, onClose }) => {
  const [scale, setScale] = useState(1);

  const increaseZoom = () => {
    if (scale < 2) setScale(prev => prev + 0.1);
  };

  const decreaseZoom = () => {
    if (scale > 0.5) setScale(prev => prev - 0.1);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">{drawingId}.pdf</h3>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={decreaseZoom}
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-sm text-gray-500 w-16 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={increaseZoom}
              >
                <ZoomIn size={20} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
                onClick={() => window.open(`https://example.com/download/${drawingId}.pdf`, '_blank')}
              >
                <Download size={20} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100">
            <div 
              className="bg-white shadow-lg transform transition-transform duration-200 ease-out" 
              style={{ transform: `scale(${scale})` }}
            >
              {/* For demo purposes, show a placeholder */}
              <div className="w-[800px] h-[1000px] flex items-center justify-center border border-gray-300 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <p className="text-xl font-medium mb-3">PDF Preview</p>
                  <p className="text-sm">This is a placeholder for the PDF preview.</p>
                  <p className="text-sm">In a real application, we would use react-pdf to render the actual PDF.</p>
                  <p className="text-sm mt-2">Drawing ID: {drawingId}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfPreview;