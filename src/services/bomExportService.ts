import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { BOMSummary, BOMItem } from './bomService';

export class BOMExportService {
  /**
   * Exports a BOM to CSV format
   * @param {BOMSummary} bom - The BOM to export
   * @returns {string} The CSV content
   */
  exportToCSV(bom: BOMSummary): string {
    // Format BOM items for CSV
    const csvData = bom.bomItems.map(item => ({
      'Item No': item.itemNo,
      'Product Code': item.productCode,
      'Description': item.description,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Unit Price': this.formatCurrency(item.unitPrice),
      'Total Price': this.formatCurrency(item.totalPrice),
      'Category': item.category,
      'Weight (kg)': item.weight || ''
    }));
    
    // Add summary rows
    csvData.push({
      'Item No': '',
      'Product Code': '',
      'Description': '',
      'Quantity': '',
      'Unit': '',
      'Unit Price': 'Subtotal Materials:',
      'Total Price': this.formatCurrency(bom.subtotals.materials),
      'Category': '',
      'Weight (kg)': ''
    });
    
    csvData.push({
      'Item No': '',
      'Product Code': '',
      'Description': '',
      'Quantity': '',
      'Unit': '',
      'Unit Price': 'Labour:',
      'Total Price': this.formatCurrency(bom.subtotals.labour),
      'Category': '',
      'Weight (kg)': ''
    });
    
    csvData.push({
      'Item No': '',
      'Product Code': '',
      'Description': '',
      'Quantity': '',
      'Unit': '',
      'Unit Price': 'Consumables:',
      'Total Price': this.formatCurrency(bom.subtotals.consumables),
      'Category': '',
      'Weight (kg)': ''
    });
    
    csvData.push({
      'Item No': '',
      'Product Code': '',
      'Description': '',
      'Quantity': '',
      'Unit': '',
      'Unit Price': 'Total:',
      'Total Price': this.formatCurrency(bom.totalCost),
      'Category': '',
      'Weight (kg)': bom.totalWeight ? `${bom.totalWeight.toFixed(2)} kg` : ''
    });
    
    // Convert to CSV
    return Papa.unparse(csvData);
  }
  
  /**
   * Exports a BOM to Excel format
   * @param {BOMSummary} bom - The BOM to export
   * @returns {Uint8Array} The Excel file content as a binary array
   */
  exportToExcel(bom: BOMSummary): Uint8Array {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create BOM items worksheet
    const itemsData = bom.bomItems.map(item => ({
      'Item No': item.itemNo,
      'Product Code': item.productCode,
      'Description': item.description,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Unit Price': item.unitPrice,
      'Total Price': item.totalPrice,
      'Category': item.category,
      'Weight (kg)': item.weight || ''
    }));
    
    const itemsWs = XLSX.utils.json_to_sheet(itemsData);
    
    // Apply formatting to numeric columns
    if (itemsData.length > 0) {
      // Get column indices
      const unitPriceCol = XLSX.utils.encode_col(Object.keys(itemsData[0]).indexOf('Unit Price'));
      const totalPriceCol = XLSX.utils.encode_col(Object.keys(itemsData[0]).indexOf('Total Price'));
      const weightCol = XLSX.utils.encode_col(Object.keys(itemsData[0]).indexOf('Weight (kg)'));
      
      // Apply currency format
      for (let i = 1; i <= itemsData.length; i++) {
        const unitPriceCell = `${unitPriceCol}${i+1}`;
        const totalPriceCell = `${totalPriceCol}${i+1}`;
        const weightCell = `${weightCol}${i+1}`;
        
        // Set cell formats
        if (itemsWs[unitPriceCell]) {
          itemsWs[unitPriceCell].z = '$#,##0.00';
        }
        if (itemsWs[totalPriceCell]) {
          itemsWs[totalPriceCell].z = '$#,##0.00';
        }
        if (itemsWs[weightCell] && itemsWs[weightCell].v) {
          itemsWs[weightCell].z = '#,##0.00';
        }
      }
    }
    
    // Add items worksheet to workbook
    XLSX.utils.book_append_sheet(wb, itemsWs, 'BOM Items');
    
    // Create summary worksheet
    const summaryData = [
      ['Project Name', bom.projectName],
      ['Product Type', bom.productType],
      ['Generated Date', format(bom.generatedDate, 'yyyy-MM-dd HH:mm:ss')],
      [''],
      ['Cost Summary'],
      ['Materials', bom.subtotals.materials],
      ['Labour', bom.subtotals.labour],
      ['Consumables', bom.subtotals.consumables],
      ['Total Cost', bom.totalCost],
      [''],
      ['Total Weight (kg)', bom.totalWeight || 0]
    ];
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Apply formatting to numeric cells
    const costCells = ['B6', 'B7', 'B8', 'B9'];
    costCells.forEach(cell => {
      if (summaryWs[cell]) {
        summaryWs[cell].z = '$#,##0.00';
      }
    });
    
    if (summaryWs['B11']) {
      summaryWs['B11'].z = '#,##0.00';
    }
    
    // Add summary worksheet to workbook
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    
    // Generate Excel file
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }
  
  /**
   * Exports a BOM to PDF format
   * @param {BOMSummary} bom - The BOM to export
   * @returns {Promise<Blob>} The PDF file content as a Blob
   */
  async exportToPDF(bom: BOMSummary): Promise<Blob> {
    // This would require a PDF generation library like jsPDF or pdfmake
    // For simplicity, I'm not implementing the full PDF generation here
    // In a real implementation, you would generate a PDF with the BOM data
    
    throw new Error('PDF export not implemented');
  }
  
  /**
   * Formats a number as currency
   * @param {number} value - The number to format
   * @returns {string} The formatted currency string
   */
  private formatCurrency(value: number): string {
    return value.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

export const bomExportService = new BOMExportService();
