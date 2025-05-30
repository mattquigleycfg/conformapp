import axios from 'axios';

interface ExcelProcessingResult {
  sheets: Record<string, any[][]>;
  formulas: Record<string, string>;
  namedRanges: Record<string, Array<{ name: string; range: string; }>>;
}

export const processExcelFile = async (file: File): Promise<ExcelProcessingResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/process-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process Excel file');
  }
};

export const evaluateFormula = (formula: string, params: Record<string, number>): number => {
  // Basic formula evaluation - expand this based on your needs
  try {
    // Replace parameter placeholders with actual values
    let evaluatedFormula = formula;
    Object.entries(params).forEach(([key, value]) => {
      evaluatedFormula = evaluatedFormula.replace(new RegExp(key, 'g'), value.toString());
    });

    // Evaluate the formula
    return Function(`'use strict'; return (${evaluatedFormula})`)();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
};