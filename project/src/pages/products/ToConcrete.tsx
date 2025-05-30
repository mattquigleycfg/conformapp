import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface ToConcreteInputs {
  width: number;
  length: number;
  height: number;
  concreteType: string;
  fixingType: string;
}

const ToConcrete: React.FC = () => {
  const [inputs, setInputs] = useState<ToConcreteInputs>({
    width: 2400,
    length: 2400,
    height: 1200,
    concreteType: 'Standard',
    fixingType: 'Chemical'
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
        <h2 className="text-xl font-semibold text-gray-900">To Concrete Calculator</h2>
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
            Length (mm)
          </label>
          <input
            type="number"
            name="length"
            value={inputs.length}
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
            Concrete Type
          </label>
          <select
            name="concreteType"
            value={inputs.concreteType}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Standard">Standard</option>
            <option value="High Strength">High Strength</option>
            <option value="Lightweight">Lightweight</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fixing Type
          </label>
          <select
            name="fixingType"
            value={inputs.fixingType}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Chemical">Chemical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Cast-in">Cast-in</option>
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

export default ToConcrete;