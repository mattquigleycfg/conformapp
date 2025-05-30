import { read, utils } from 'xlsx';
import { DrawingRecord } from '../types';

export const parseExcelFile = (file: File): Promise<DrawingRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to array of objects
        const rawData = utils.sheet_to_json<Record<string, any>>(worksheet);
        
        // Normalize the data to match our DrawingRecord type
        const normalizedData: DrawingRecord[] = rawData.map(row => ({
          WIDTH: Number(row['WIDTH'] || 0),
          LENGTH: Number(row['LENGTH'] || 0),
          PITCH: isNaN(Number(row['PITCH'])) ? row['PITCH'] : Number(row['PITCH']),
          START_HEIGHT: Number(row['START HEIGHT'] || 0),
          BOX_GUTTER: String(row['BOX GUTTER'] || ''),
          RIDGE: String(row['RIDGE'] || ''),
          CAPACITY: Number(row['CAPACITY (kpa)'] || row['CAPACITY'] || 0),
          SHOP_DRAWING: String(row['SHOP DRAWING'] || '')
        }));
        
        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsBinaryString(file);
  });
};

// Sample data that matches the image provided
export const getSampleData = (): DrawingRecord[] => {
  return [
    { WIDTH: 1200, LENGTH: 1200, PITCH: 1, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1200-1' },
    { WIDTH: 1200, LENGTH: 1200, PITCH: 1.5, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1200-1.5' },
    { WIDTH: 1200, LENGTH: 1200, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1200-2' },
    { WIDTH: 1200, LENGTH: 1200, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1200-3' },
    { WIDTH: 1200, LENGTH: 1800, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1800-2' },
    { WIDTH: 1200, LENGTH: 1800, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'BAL-PAR-P4-1800-1200-2' },
    { WIDTH: 1200, LENGTH: 1800, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1200-1800-3' },
    { WIDTH: 1800, LENGTH: 1200, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1800-1200-2' },
    { WIDTH: 1800, LENGTH: 1200, PITCH: 15, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'ARM-REE-P123-1800-1200-15-REV2' },
    { WIDTH: 1800, LENGTH: 1200, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1800-1200-3' },
    { WIDTH: 1800, LENGTH: 1800, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1800-1800-2' },
    { WIDTH: 1800, LENGTH: 1800, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-1800-1800-3' },
    { WIDTH: 1800, LENGTH: 3000, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'ART-AUD-1800-3000-2' },
    { WIDTH: 1800, LENGTH: 11400, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'ALE-MCE-1800-11400-3' },
    { WIDTH: 2400, LENGTH: 1200, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'SHOP DRAWINGS\\BAL-PAR-P1-P2-2400-1200-2' },
    { WIDTH: 2400, LENGTH: 2400, PITCH: 1, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-2400-2400-1' },
    { WIDTH: 2400, LENGTH: 2400, PITCH: 2, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-2400-2400-2' },
    { WIDTH: 2400, LENGTH: 2400, PITCH: 2.5, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'ALE-BUR-2400-2400-2.5-REV2' },
    { WIDTH: 2400, LENGTH: 2400, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'CFG-GALAXY-PLAT-2400-2400-3' },
    { WIDTH: 2400, LENGTH: 2400, PITCH: 3, START_HEIGHT: 200, BOX_GUTTER: 'NO', RIDGE: 'NO', CAPACITY: 2.5, SHOP_DRAWING: 'ALE-BUR-2400-2400-3-REV2' },
  ];
};