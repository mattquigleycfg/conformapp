import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileDown } from 'lucide-react';
import { calculateEasyMechMR, type EasyMechMRInputs, type EasyMechMRResults } from '../../services/calculations/easyMechMRCalculator';

const ROOF_TYPES = ['Kliplok 700', 'Spandek', 'Trimdek', 'Custom'];
const FLOORING_TYPES = ['Mesh', 'Solid', 'Perforated'];
const LOAD_RATINGS = [2.5, 5.0];
const LOCATIONS = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

const defaultInputs: EasyMechMRInputs = {
  pitch: 3,
  width: 8400,
  length: 8400,
  startHeight: 400,
  roofType: 'Kliplok 700',
  flooring: 'Mesh',
  loadRating: 2.5,
  kit: false,
  ridge: false,
  side1: 0,
  side2: 0,
  location: 'NSW'
};

const EasyMechMR: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<EasyMechMRInputs>(defaultInputs);
  const [results, setResults] = useState<EasyMechMRResults | null>(null);

  useEffect(() => {
    const newResults = calculateEasyMechMR(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (name: keyof EasyMechMRInputs, value: string | number | boolean) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/calculator')}
          className="flex items-center text-gray-600 hover:text-gray-800 font-mono"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Calculator
        </button>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-mono">
            <Save className="w-5 h-5 mr-2" />
            Save Project
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-mono">
            <FileDown className="w-5 h-5 mr-2" />
            Export BoM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-medium text-gray-800">EasyMech MR Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pitch (degrees)</label>
              <input
                type="number"
                value={inputs.pitch}
                onChange={(e) => handleInputChange('pitch', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Width (mm)</label>
              <input
                type="number"
                value={inputs.width}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Length (mm)</label>
              <input
                type="number"
                value={inputs.length}
                onChange={(e) => handleInputChange('length', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Height (mm)</label>
              <input
                type="number"
                value={inputs.startHeight}
                onChange={(e) => handleInputChange('startHeight', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roof Type</label>
              <select
                value={inputs.roofType}
                onChange={(e) => handleInputChange('roofType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {ROOF_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Flooring</label>
              <select
                value={inputs.flooring}
                onChange={(e) => handleInputChange('flooring', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {FLOORING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Load Rating (kPa)</label>
              <select
                value={inputs.loadRating}
                onChange={(e) => handleInputChange('loadRating', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {LOAD_RATINGS.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                value={inputs.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Side 1 (mm)</label>
              <input
                type="number"
                value={inputs.side1}
                onChange={(e) => handleInputChange('side1', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Side 2 (mm)</label>
              <input
                type="number"
                value={inputs.side2}
                onChange={(e) => handleInputChange('side2', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="col-span-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={inputs.kit}
                  onChange={(e) => handleInputChange('kit', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2">Kit</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={inputs.ridge}
                  onChange={(e) => handleInputChange('ridge', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2">Ridge</span>
              </label>
            </div>
          </div>

          {results && !results.gapValidation.isValid && (
            <div className="mt-4 text-red-600 text-sm">
              {results.gapValidation.message}
            </div>
          )}
        </div>

        {/* Results Display */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-medium text-gray-800">Calculation Results</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Platform Area</label>
                  <p className="text-lg font-medium">{results.platformArea.toFixed(2)} m²</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">End Height</label>
                  <p className="text-lg font-medium">{results.endHeight.toFixed(0)} mm</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Platform Weight</label>
                  <p className="text-lg font-medium">{results.platformWeight.toFixed(0)} kg</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Man Days</label>
                  <p className="text-lg font-medium">{results.manDays.toFixed(1)} days</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Truss End Height</label>
                  <p className="text-lg font-medium">{results.trussEndHeight.toFixed(0)} mm</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Rate per m²</label>
                  <p className="text-lg font-medium">${results.costs.perSqmRate.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Cost Breakdown</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Cost</span>
                    <span className="font-medium">${results.costs.platformCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Production Labour</span>
                    <span className="font-medium">${results.costs.productionLabour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engineering Labour</span>
                    <span className="font-medium">${results.costs.engineeringLabour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packaging & Consumables</span>
                    <span className="font-medium">${results.costs.packagingConsumables.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">COGS Running Costs</span>
                    <span className="font-medium">${results.costs.cogsRunningCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span className="text-gray-600">Sub Total</span>
                    <span>${results.costs.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contingency</span>
                    <span className="font-medium">${results.costs.contingency.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span className="text-gray-600">Grand Total</span>
                    <span>${results.costs.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GP %</span>
                    <span className="font-medium">{(results.costs.gpPercentage * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between font-medium text-primary-600">
                    <span>Platform Sale Price</span>
                    <span>${results.costs.platformSalePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-primary-600">
                    <span>Labour Sale Price</span>
                    <span>${results.costs.labourSalePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasyMechMR;