export interface StandardInputs {
  height: number;
  width: number;
  length: number;
  active: boolean;
  openingType: 'None' | 'Door' | 'Window';
  openingWidth: number;
  openingLocation: number;
  claddingType: string;
  colour: string;
  gpPercent: number;
}

export interface StandardResults {
  screenArea: number;
  effectiveArea: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const CLADDING_RATES = {
  'STANDARD': 85,
  'POWDER COATED': 95,
  'ANODIZED': 100
};

const LABOUR_RATE = 0.15;
const DEFAULT_GP_PERCENTAGE = 0.45;

export const calculateStandard = (inputs: StandardInputs): StandardResults => {
  // Screen Area calculation
  const screenArea = (inputs.height * inputs.length) / 1000000;
  
  // Adjust for openings
  let effectiveArea = screenArea;
  if (inputs.openingType !== 'None' && inputs.openingWidth > 0) {
    const openingArea = (inputs.height * inputs.openingWidth) / 1000000;
    effectiveArea = screenArea - openingArea;
  }
  
  // Material cost based on cladding type
  const materialRate = CLADDING_RATES[inputs.claddingType as keyof typeof CLADDING_RATES] || CLADDING_RATES.STANDARD;
  const materialCost = effectiveArea * materialRate;
  
  // Labour cost
  const labourCost = materialCost * LABOUR_RATE;
  
  // Total cost and sale price
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    screenArea,
    effectiveArea,
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};