import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDropboxAuth } from '../hooks/useDropboxAuth';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import PdfPreview from '../components/PdfPreview';
import RecentlyViewed from '../components/RecentlyViewed';
import FileUploadForm from '../components/FileUploadForm';
import FolderNavigation from '../components/FolderNavigation';
import DesignCalculator from '../components/DesignCalculator';
import OdooIntegration from '../components/OdooIntegration';
import Calculator from './Calculator';
import { DisplayDrawingRecord } from '../types';
import { useFilters } from '../hooks/useFilters';
import { useSorting } from '../hooks/useSorting';
import { usePdfPreview } from '../hooks/usePdfPreview';
import { listFiles, listFolders, getFilePreview } from '../utils/dropbox';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DisplayDrawingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentDrawings, setRecentDrawings] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const { filters, filteredData, updateFilter, clearFilters, filterOptions } = useFilters(data);
  const { sortedData, sortConfig, requestSort } = useSorting(filteredData);
  const { pdfUrl, isPdfOpen, openPdf, closePdf } = usePdfPreview();
  const [activeTab, setActiveTab] = useState<'search' | 'upload' | 'design' | 'odoo' | 'calculator'>('search');
  const { isAuthenticated } = useDropboxAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const loadFolders = async () => {
      try {
        const folderList = await listFolders();
        setFolders(folderList);
        if (folderList.length > 0) {
          setCurrentFolder(folderList[0]);
        }
      } catch (error: any) {
        console.error('Error loading folders:', error);
        setError(error.message || 'Failed to load folders');
      }
    };

    loadFolders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !currentFolder) return;

    const loadDrawings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const files = await listFiles(currentFolder);
        const transformedDrawings = files
          .filter(file => file.name.toLowerCase().endsWith('.pdf'))
          .map(file => {
            const parts = file.name.replace('.pdf', '').split('-');
            return {
              WIDTH: parseInt(parts[3] || '0'),
              LENGTH: parseInt(parts[4] || '0'),
              PITCH: parseFloat(parts[5] || '0'),
              START_HEIGHT: 200,
              BOX_GUTTER: 'NO',
              RIDGE: 'NO',
              CAPACITY: 2.5,
              SHOP_DRAWING: `${currentFolder}/${file.name.replace('.pdf', '')}`
            };
          });
        setData(transformedDrawings);
      } catch (error: any) {
        console.error('Error loading drawings:', error);
        setError(error.message || 'Failed to load drawings');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrawings();
  }, [isAuthenticated, currentFolder]);

  const handleViewPdf = async (drawingId: string) => {
    if (!isAuthenticated) {
      setError('Please login to view drawings');
      return;
    }

    try {
      const previewUrl = await getFilePreview(`${drawingId}.pdf`);
      if (previewUrl) {
        openPdf(previewUrl);
        setRecentDrawings(prev => {
          const updatedRecent = prev.filter(id => id !== drawingId);
          return [drawingId, ...updatedRecent].slice(0, 5);
        });
      }
    } catch (error: any) {
      console.error('Error getting PDF URL:', error);
      setError(error.message || 'Failed to load PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/dashboard' },
              { label: currentFolder || 'All Folders' }
            ]}
          />
        </div>

        <div className="mb-6 flex space-x-4">
          {['search', 'upload', 'design', 'calculator', 'odoo'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg font-mono transition-colors ${
                activeTab === tab
                  ? tab === 'odoo'
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'search' && (
          <div className="space-y-6">
            <FolderNavigation 
              folders={folders}
              currentFolder={currentFolder}
              onFolderSelect={setCurrentFolder}
            />
            
            <RecentlyViewed 
              recentDrawings={recentDrawings}
              onViewPdf={handleViewPdf}
            />
            
            <FilterBar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
            />
            
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p>{error}</p>
                <p className="text-sm mt-2">Please check your configuration and ensure you have the correct permissions.</p>
              </div>
            ) : (
              <DataTable
                data={sortedData}
                sortConfig={sortConfig}
                onSort={requestSort}
                onViewPdf={handleViewPdf}
              />
            )}
          </div>
        )}

        {activeTab === 'upload' && <FileUploadForm />}
        {activeTab === 'design' && <DesignCalculator isVisible={true} />}
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'odoo' && <OdooIntegration />}
        
        {isPdfOpen && pdfUrl && (
          <PdfPreview
            pdfUrl={pdfUrl}
            drawingId={recentDrawings[0] || ''}
            onClose={closePdf}
          />
        )}
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            Shop Drawings Lookup © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;