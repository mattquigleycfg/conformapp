import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface GuardrailInputs {
  length: number;
  returnLength: number;
  mountType: string;
  finish: string;
}

const Guardrail: React.FC = () => {
  const [inputs, setInputs] = useState<GuardrailInputs>({
    length: 6000,
    returnLength: 1200,
    mountType: 'Top Mount',
    finish: 'Mill'
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
        <h2 className="text-xl font-semibold text-gray-900">Guardrail Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Return Length (mm)
          </label>
          <input
            type="number"
            name="returnLength"
            value={inputs.returnLength}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mount Type
          </label>
          <select
            name="mountType"
            value={inputs.mountType}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Top Mount">Top Mount</option>
            <option value="Side Mount">Side Mount</option>
            <option value="Core Mount">Core Mount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Finish
          </label>
          <select
            name="finish"
            value={inputs.finish}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Mill">Mill</option>
            <option value="Clear Anodized">Clear Anodized</option>
            <option value="Powder Coated">Powder Coated</option>
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

export default Guardrail;