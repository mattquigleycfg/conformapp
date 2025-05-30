export interface ToRoofInputs {
  height: number;
  width: number;
  length: number;
  active: boolean;
  openingType: string;
  openingWidth: number;
  openingLocation: number;
  claddingType: string;
  colour: string;
  gpPercent: number;
}

export interface ToRoofResults {
  screenArea: number;
  attachmentCount: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const CLADDING_RATES = {
  'LV100': 95,
  'LV200': 105,
  'Solid': 85
};

const ATTACHMENT_SPACING = 1200;
const ATTACHMENT_COST = 25;
const LABOUR_RATE = 0.18;

export const calculateToRoof = (inputs: ToRoofInputs): ToRoofResults => {
  const screenArea = (inputs.height * inputs.length) / 1000000;
  
  // Attachment points calculation
  const attachmentCount = Math.ceil(inputs.length / ATTACHMENT_SPACING);
  
  // Material cost calculation
  const materialRate = CLADDING_RATES[inputs.claddingType as keyof typeof CLADDING_RATES] || 
                      CLADDING_RATES.LV100;
  const materialCost = (screenArea * materialRate) + (attachmentCount * ATTACHMENT_COST);
  
  const labourCost = materialCost * LABOUR_RATE;
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    screenArea,
    attachmentCount,
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};