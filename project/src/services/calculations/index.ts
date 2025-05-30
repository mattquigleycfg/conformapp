// Export all calculator functions
export * from './easyMechMRCalculator';
export * from './easyMechCRCalculator';
export * from './spanPlusCalculator';
export * from './walkwayCalculator';
export * from './standardCalculator';
export * from './rfScreenCalculator';
export * from './acousticLouvreCalculator';
export * from './guardrailCalculator';
export * from './toConcreteCalculator';
export * from './toRoofCalculator';

// Common utility functions
export const calculateArea = (width: number, length: number): number => {
  return (width * length) / 1000000;
};

export const calculateEndHeight = (pitch: number, width: number, startHeight: number): number => {
  return (Math.tan(pitch * Math.PI / 180) * width) + startHeight;
};

export const calculateContingency = (
  location: string,
  loadRating: number,
  subtotal: number,
  area: number
): number => {
  let baseRate = 0;
  
  // Base rates by location
  switch (location) {
    case 'NSW':
      baseRate = loadRating === 5.0 ? 350 : 300;
      break;
    case 'VIC':
      baseRate = loadRating === 5.0 ? 340 : 290;
      break;
    case 'QLD':
      baseRate = loadRating === 5.0 ? 330 : 280;
      break;
    case 'SA':
      baseRate = loadRating === 5.0 ? 320 : 270;
      break;
    case 'WA':
      baseRate = loadRating === 5.0 ? 310 : 260;
      break;
    default:
      baseRate = loadRating === 5.0 ? 300 : 250;
  }
  
  const currentRate = subtotal / area;
  return currentRate < baseRate ? (baseRate - currentRate) * area : 0;
};