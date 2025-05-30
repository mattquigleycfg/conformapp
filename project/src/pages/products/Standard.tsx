import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CalculationResult {
  postSpacing: number;
  numberOfPosts: number;
  railLength: number;
}

const Standard: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateDesign = () => {
    // Basic calculation logic - this should be enhanced based on actual requirements
    const maxPostSpacing = 2400; // Maximum spacing between posts in mm
    const numberOfPosts = Math.ceil(width / maxPostSpacing) + 1;
    const actualPostSpacing = width / (numberOfPosts - 1);
    const railLength = width;

    setResult({
      postSpacing: Math.round(actualPostSpacing),
      numberOfPosts: numberOfPosts,
      railLength: railLength
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width (mm)
          </label>
          <input
            type="number"
            value={width || ''}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            min="0"
            step="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (mm)
          </label>
          <input
            type="number"
            value={height || ''}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            min="0"
            step="1"
          />
        </div>
      </div>

      <div>
        <button
          onClick={calculateDesign}
          disabled={!width || !height}
          className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Post Spacing: <span className="font-medium text-gray-900">{result.postSpacing}mm</span>
            </p>
            <p className="text-sm text-gray-600">
              Number of Posts: <span className="font-medium text-gray-900">{result.numberOfPosts}</span>
            </p>
            <p className="text-sm text-gray-600">
              Rail Length: <span className="font-medium text-gray-900">{result.railLength}mm</span>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Standard;