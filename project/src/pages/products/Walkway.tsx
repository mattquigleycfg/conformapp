import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileDown, Plus, Minus } from 'lucide-react';
import { calculateWalkway, type WalkwaySection, type WalkwayInputs, type WalkwayResults } from '../../services/calculations/walkwayCalculator';

const SURFACE_TYPES = ['Mesh', 'Solid', 'Perforated'];
const DEFAULT_SECTION: WalkwaySection = {
  name: 'L-1',
  length: 6000,
  handrail: 'two-sides',
  active: true
};

const Walkway: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<WalkwaySection[]>([DEFAULT_SECTION]);
  const [inputs, setInputs] = useState<WalkwayInputs>({
    sections: [DEFAULT_SECTION],
    width: 1200,
    surfaceType: 'Mesh',
    gpPercent: 0.45
  });
  const [results, setResults] = useState<WalkwayResults | null>(null);

  useEffect(() => {
    const newResults = calculateWalkway(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (name: keyof WalkwayInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (index: number, field: keyof WalkwaySection, value: any) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setSections(newSections);
    handleInputChange('sections', newSections);
  };

  const addSection = () => {
    const newSection: WalkwaySection = {
      name: `L-${sections.length + 1}`,
      length: 6000,
      handrail: 'two-sides',
      active: true
    };
    setSections([...sections, newSection]);
    handleInputChange('sections', [...sections, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    handleInputChange('sections', newSections);
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
          <h2 className="text-xl font-medium text-gray-800">Walkway Parameters</h2>
          
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Surface Type</label>
              <select
                value={inputs.surfaceType}
                onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {SURFACE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Sections</h3>
                <button
                  onClick={addSection}
                  className="flex items-center px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700">{section.name}</h4>
                      {sections.length > 1 && (
                        <button
                          onClick={() => removeSection(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Length (mm)</label>
                        <input
                          type="number"
                          value={section.length}
                          onChange={(e) => handleSectionChange(index, 'length', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Handrail</label>
                        <select
                          value={section.handrail}
                          onChange={(e) => handleSectionChange(index, 'handrail', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="none">None</option>
                          <option value="one-side">One Side</option>
                          <option value="two-sides">Two Sides</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <label className="block text-sm font-medium text-gray-500">Total Length</label>
                  <p className="text-lg font-medium">{(results.totalLength / 1000).toFixed(2)} m</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Area</label>
                  <p className="text-lg font-medium">{results.totalArea.toFixed(2)} m²</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Man Days</label>
                  <p className="text-lg font-medium">{results.manDays} days</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Section Costs</h3>
                
                <div className="space-y-4">
                  {Object.entries(results.sectionCosts).map(([name, costs]) => (
                    <div key={name} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{name}</span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Material: ${costs.cost.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Labour: ${costs.labour.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Total Cost</span>
                    <span className="font-medium">${results.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-primary-600">Sale Price</span>
                    <span className="font-medium text-primary-600">${results.salePrice.toFixed(2)}</span>
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

export default Walkway;