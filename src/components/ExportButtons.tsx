import React from 'react';
import { format } from 'date-fns';
import { BOMSummary, bomService } from '../services/bomService';
import { Download, FileSpreadsheet, Printer, Cloud } from 'lucide-react';

// Helper function to download a file
const downloadFile = (content: string | ArrayBuffer, fileName: string, contentType: string): void => {
  const a = document.createElement('a');
  let blob;
  
  if (typeof content === 'string') {
    blob = new Blob([content], { type: contentType });
  } else {
    blob = new Blob([content], { type: contentType });
  }
  
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

interface ExportButtonsProps {
  bom: BOMSummary;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ bom }) => {
  const handleExportCSV = async () => {
    const csv = await bomService.exportToCSV(bom);
    downloadFile(csv, `BOM_${bom.productType}_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
  };

  const handleExportExcel = async () => {
    const excel = await bomService.exportToExcel(bom);
    downloadFile(excel, `BOM_${bom.productType}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToDropbox = async () => {
    // This would require Dropbox API integration
    alert('Dropbox integration not implemented yet');
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleExportCSV} className="btn btn-secondary">
        <Download className="w-4 h-4 mr-2" /> CSV
      </button>
      <button onClick={handleExportExcel} className="btn btn-secondary">
        <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
      </button>
      <button onClick={handlePrint} className="btn btn-secondary">
        <Printer className="w-4 h-4 mr-2" /> Print
      </button>
      <button onClick={handleSaveToDropbox} className="btn btn-secondary">
        <Cloud className="w-4 h-4 mr-2" /> Save to Dropbox
      </button>
    </div>
  );
};
