import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileDown } from 'lucide-react';
import { calculateSpanPlus, type SpanPlusInputs, type SpanPlusResults } from '../../services/calculations/spanPlusCalculator';

const LOCATIONS = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
const LOAD_RATINGS = [2.5, 5.0];

const defaultInputs: SpanPlusInputs = {
  pitch: 3,
  width: 8400,
  rafterSpacing: 1200,
  totalLength: 8400,
  bays: 7,
  kit: false,
  stubSpacing: 600,
  startHeight: 400,
  loadRating: 2.5,
  location: 'NSW',
  gpPercent: 0.45
};

const SpanPlus: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SpanPlusInputs>(defaultInputs);
  const [results, setResults] = useState<SpanPlusResults | null>(null);

  useEffect(() => {
    const newResults = calculateSpanPlus(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (name: keyof SpanPlusInputs, value: string | number | boolean) => {
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
          <h2 className="text-xl font-medium text-gray-800">Span+ Parameters</h2>
          
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
              <label className="block text-sm font-medium text-gray-700">Total Length (mm)</label>
              <input
                type="number"
                value={inputs.totalLength}
                onChange={(e) => handleInputChange('totalLength', parseFloat(e.target.value))}
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
              <label className="block text-sm font-medium text-gray-700">Rafter Spacing (mm)</label>
              <input
                type="number"
                value={inputs.rafterSpacing}
                onChange={(e) => handleInputChange('rafterSpacing', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Bays</label>
              <input
                type="number"
                value={inputs.bays}
                onChange={(e) => handleInputChange('bays', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stub Spacing (mm)</label>
              <input
                type="number"
                value={inputs.stubSpacing}
                onChange={(e) => handleInputChange('stubSpacing', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
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

            <div className="col-span-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={inputs.kit}
                  onChange={(e) => handleInputChange('kit', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2">Kit</span>
              </label>
            </div>
          </div>
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
                  <label className="block text-sm font-medium text-gray-500">Screen Area</label>
                  <p className="text-lg font-medium">{results.screenArea.toFixed(2)} m²</p>
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
                  <label className="block text-sm font-medium text-gray-500">Rate per m²</label>
                  <p className="text-lg font-medium">${results.costs.perSqmRate.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Cost Breakdown</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Cost</span>
                    <span className="font-medium">${results.costs.platform.toFixed(2)}</span>
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
                    <span className="font-medium">${results.costs.packaging.toFixed(2)}</span>
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

export default SpanPlus;