import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentlyViewedProps {
  recentDrawings: string[];
  onViewPdf: (drawingId: string) => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ recentDrawings, onViewPdf }) => {
  if (recentDrawings.length === 0) return null;
  
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center mb-3">
        <Clock size={16} className="text-gray-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-700">Recently Viewed</h3>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {recentDrawings.map((drawingId, index) => (
          <motion.div
            key={drawingId}
            className="flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onViewPdf(drawingId)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="w-48 h-32 bg-gray-100 flex items-center justify-center">
              <FileText size={32} className="text-gray-400" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate" title={drawingId}>
                {drawingId}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;