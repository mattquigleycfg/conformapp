import React from 'react';
import { format } from 'date-fns';
import { BOMSummary } from '../services/bomService';
import { bomExportService } from '../services/bomExportService';
import { FileText, FileSpreadsheet, FilePdf, Printer, Save } from 'lucide-react';

interface BOMExportButtonsProps {
  bom: BOMSummary;
  className?: string;
}

const BOMExportButtons: React.FC<BOMExportButtonsProps> = ({ bom, className }) => {
  const handleExportCSV = () => {
    const csvContent = bomExportService.exportToCSV(bom);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BOM_${bom.projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const excelContent = bomExportService.exportToExcel(bom);
    const blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BOM_${bom.projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    try {
      const pdfContent = await bomExportService.exportToPDF(bom);
      const url = URL.createObjectURL(pdfContent);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BOM_${bom.projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDF export is not implemented yet.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    // This would save the BOM to Supabase
    // You could implement this in the bomService
    alert('Save functionality not implemented yet.');
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={handleExportCSV}
        className="btn btn-secondary flex items-center gap-1"
      >
        <FileText size={16} />
        CSV
      </button>
      
      <button
        onClick={handleExportExcel}
        className="btn btn-secondary flex items-center gap-1"
      >
        <FileSpreadsheet size={16} />
        Excel
      </button>
      
      <button
        onClick={handleExportPDF}
        className="btn btn-secondary flex items-center gap-1"
      >
        <FilePdf size={16} />
        PDF
      </button>
      
      <button
        onClick={handlePrint}
        className="btn btn-secondary flex items-center gap-1"
      >
        <Printer size={16} />
        Print
      </button>
      
      <button
        onClick={handleSave}
        className="btn btn-primary flex items-center gap-1"
      >
        <Save size={16} />
        Save
      </button>
    </div>
  );
};

export default BOMExportButtons;
