import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface DesignCalculatorProps {
  isVisible: boolean;
}

const DesignCalculator: React.FC<DesignCalculatorProps> = ({ isVisible }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const script = document.createElement('script');
      script.src = 'https://scripts.convertcalculator.com/embed.js';
      script.async = true;
      
      // Handle script loading
      script.onload = () => {
        setIsLoading(false);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-light text-gray-800 mb-4">Design Calculator</h2>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-primary-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading calculator...</span>
        </div>
      )}

      <div 
        className={`calculator w-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        data-calc-id="wg7LEwjrCSmLsATHP" 
        data-type="framed"
        style={{
          height: '800px',
          minHeight: '800px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 10
        }}
      />
    </div>
  );
};

export default DesignCalculator;