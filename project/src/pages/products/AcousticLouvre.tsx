import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface AcousticLouvreInputs {
  width: number;
  height: number;
  depth: number;
  bladeType: string;
  noiseReduction: number;
}

const AcousticLouvre: React.FC = () => {
  const [inputs, setInputs] = useState<AcousticLouvreInputs>({
    width: 1200,
    height: 1200,
    depth: 300,
    bladeType: 'Standard',
    noiseReduction: 25
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Acoustic Louvre Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (mm)
          </label>
          <input
            type="number"
            name="width"
            value={inputs.width}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (mm)
          </label>
          <input
            type="number"
            name="height"
            value={inputs.height}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depth (mm)
          </label>
          <input
            type="number"
            name="depth"
            value={inputs.depth}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blade Type
          </label>
          <select
            name="bladeType"
            value={inputs.bladeType}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Ultra">Ultra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Noise Reduction (dB)
          </label>
          <select
            name="noiseReduction"
            value={inputs.noiseReduction}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="25">25 dB</option>
            <option value="30">30 dB</option>
            <option value="35">35 dB</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Calculate
        </button>
      </div>
    </div>
  );
};

export default AcousticLouvre;