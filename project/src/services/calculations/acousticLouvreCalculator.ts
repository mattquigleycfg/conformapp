export interface AcousticLouvreInputs {
  height: number;
  width: number;
  length: number;
  active: boolean;
  openingType: string;
  openingWidth: number;
  openingLocation: number;
  screenType: 'Acoustic+ LouvreWall' | 'UltraWall';
  louvreDepth: number;
  colour: string;
  caseWidth: number;
  option: 'A' | 'B' | 'C';
  gpPercent: number;
}

export interface AcousticLouvreResults {
  screenArea: number;
  acousticRating: string;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const OPTION_MULTIPLIERS = {
  'A': 1.0,  // Rw 22
  'B': 1.15, // Rw 25
  'C': 1.3   // Rw 28
};

const ACOUSTIC_RATINGS = {
  'A': 'Rw 22',
  'B': 'Rw 25',
  'C': 'Rw 28'
};

const BASE_RATE = {
  'Acoustic+ LouvreWall': 180,
  'UltraWall': 220
};

const LABOUR_RATE = 0.20;
const DEPTH_PREMIUM_THRESHOLD = 300;
const DEPTH_PREMIUM_MULTIPLIER = 1.1;

export const calculateAcousticLouvre = (inputs: AcousticLouvreInputs): AcousticLouvreResults => {
  const screenArea = (inputs.height * inputs.length) / 1000000;
  
  // Base rate depends on screen type and louvre depth
  let baseRate = BASE_RATE[inputs.screenType];
  if (inputs.louvreDepth > DEPTH_PREMIUM_THRESHOLD) {
    baseRate *= DEPTH_PREMIUM_MULTIPLIER;
  }
  
  const materialCost = screenArea * baseRate * OPTION_MULTIPLIERS[inputs.option];
  const labourCost = materialCost * LABOUR_RATE;
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    screenArea,
    acousticRating: ACOUSTIC_RATINGS[inputs.option],
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};