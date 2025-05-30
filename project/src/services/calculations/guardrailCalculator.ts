export interface GuardrailInputs {
  width: number;
  length: number;
  active: boolean;
  openingType: 'None' | 'Gate';
  openingWidth: number;
  openingLocation: number;
  railType: 'Standard' | 'Heavy Duty';
  gpPercent: number;
}

export interface GuardrailResults {
  perimeter: number;
  effectiveLength: number;
  postCount: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  salePrice: number;
}

const RAIL_COST_PER_METER = {
  'Standard': 65,
  'Heavy Duty': 85
};

const POST_COST = 120;
const POST_SPACING = 2400;
const LABOUR_RATE = 0.25;

export const calculateGuardrail = (inputs: GuardrailInputs): GuardrailResults => {
  // Calculate perimeter
  const perimeter = (inputs.width + inputs.length) * 2;
  
  // Adjust for openings
  let effectiveLength = perimeter;
  if (inputs.openingType === 'Gate') {
    effectiveLength -= inputs.openingWidth;
  }
  
  // Post count calculation
  const postCount = Math.ceil(effectiveLength / POST_SPACING) + 1;
  
  // Cost calculations
  const railCostPerMeter = RAIL_COST_PER_METER[inputs.railType];
  const materialCost = (effectiveLength / 1000 * railCostPerMeter) + (postCount * POST_COST);
  const labourCost = materialCost * LABOUR_RATE;
  const totalCost = materialCost + labourCost;
  const salePrice = totalCost / (1 - inputs.gpPercent);
  
  return {
    perimeter,
    effectiveLength,
    postCount,
    materialCost,
    labourCost,
    totalCost,
    salePrice
  };
};