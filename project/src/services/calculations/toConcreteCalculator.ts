export interface ToConcreteInputs {
  height: number;
  width: number;
  length: number;
  active: boolean;
  openingType: string;
  openingWidth: number;
  openingLocation: number;
  claddingAcoustic: 'Louvre' | 'Solid Panel';
  colour: string;
  cassetteWidth: number;
  frameType: 'Posts' | 'Channel';
  gpPercent: number;
}

export interface ToConcreteResults {
  screenArea: number;
  anchorCount: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const BASE_MATERIAL_RATES = {
  'Louvre': 110,
  'Solid Panel': 90
};

const FRAME_MULTIPLIERS = {
  'Posts': 1.0,
  'Channel': 1.2
};

const ANCHOR_SPACING = 600;
const ANCHOR_COST = 15;
const LABOUR_RATE = 0.22;

export const calculateToConcrete = (inputs: ToConcreteInputs): ToConcreteResults => {
  const screenArea = (inputs.height * inputs.length) / 1000000;
  
  // Anchor calculations
  const anchorCount = Math.ceil(inputs.length / ANCHOR_SPACING) + 
                     Math.ceil(inputs.width / ANCHOR_SPACING);
  
  // Material cost calculation
  const baseMaterialRate = BASE_MATERIAL_RATES[inputs.claddingAcoustic];
  const frameMultiplier = FRAME_MULTIPLIERS[inputs.frameType];
  const materialCost = (screenArea * baseMaterialRate * frameMultiplier) + 
                      (anchorCount * ANCHOR_COST);
  
  const labourCost = materialCost * LABOUR_RATE;
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    screenArea,
    anchorCount,
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};