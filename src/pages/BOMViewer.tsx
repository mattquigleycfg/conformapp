import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { BOMSummary, bomService } from '../services/bomService';
import { BOMTable } from '../components/BOMTable';
import { ExportButtons } from '../components/ExportButtons';
import { Search, Filter } from 'lucide-react';

const BOMViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bom, setBom] = useState<BOMSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBOM = async () => {
      if (!id) {
        // If no ID, load all BOMs
        try {
          const boms = await bomService.getAllBOMs();
          // Just display the first one or handle this differently
          if (boms.length > 0) {
            setBom(boms[0]);
          } else {
            setError('No BOMs found');
          }
        } catch (err) {
          setError('Failed to load BOMs');
          console.error(err);
        }
      } else {
        // Load specific BOM by ID
        try {
          const loadedBom = await bomService.getBOMById(id);
          if (loadedBom) {
            setBom(loadedBom);
          } else {
            setError('BOM not found');
          }
        } catch (err) {
          setError('Failed to load BOM');
          console.error(err);
        }
      }
      setLoading(false);
    };
    
    fetchBOM();
  }, [id]);
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading BOM data...</div>;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center p-8">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 btn btn-primary"
          onClick={() => navigate('/bom')}
        >
          View All BOMs
        </button>
      </div>
    );
  }
  
  if (!bom) {
    return <div className="flex justify-center p-8">No BOM data available</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Bill of Materials</h1>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">Project: {bom.projectName}</p>
            <p className="text-sm text-gray-600">
              Product Type: {bom.productType} | 
              Generated: {format(bom.generatedDate, 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <ExportButtons bom={bom} />
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <BOMTable items={bom.bomItems} showTotals={true} />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Materials</h3>
          <p className="text-2xl">{bom.subtotals.materials.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Labour</h3>
          <p className="text-2xl">{bom.subtotals.labour.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Total Cost</h3>
          <p className="text-2xl font-bold">{bom.totalCost.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</p>
        </div>
      </div>
    </div>
  );
};

export default BOMViewer;
