export interface RFScreenInputs {
  height: number;
  width: number;
  length: number;
  active: boolean;
  openingType: string;
  openingWidth: number;
  openingLocation: number;
  claddingAcoustic: string;
  colour: string;
  cassetteWidth: number;
  louvreSpacing: number;
  basePlatform?: string;
  gpPercent: number;
}

export interface RFScreenResults {
  screenArea: number;
  louvreCount: number;
  louvreArea: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const BASE_MATERIAL_RATE = 120;
const ACOUSTIC_PREMIUM = 25;
const LABOUR_RATE = 0.18;

export const calculateRFScreen = (inputs: RFScreenInputs): RFScreenResults => {
  const screenArea = (inputs.height * inputs.length) / 1000000;
  
  // Louvre calculations
  const louvreCount = Math.floor(inputs.height / inputs.louvreSpacing);
  const louvreArea = (louvreCount * inputs.cassetteWidth * inputs.length) / 1000000;
  
  // Cost calculations with acoustic premium
  let materialRate = BASE_MATERIAL_RATE;
  if (inputs.claddingAcoustic.includes('AeroWall')) {
    materialRate += ACOUSTIC_PREMIUM;
  }
  
  const materialCost = screenArea * materialRate;
  const labourCost = materialCost * LABOUR_RATE;
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    screenArea,
    louvreCount,
    louvreArea,
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};