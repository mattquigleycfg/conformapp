export interface WalkwaySection {
  name: string;
  length: number;
  handrail: 'none' | 'one-side' | 'two-sides';
  active: boolean;
}

export interface WalkwayInputs {
  sections: WalkwaySection[];
  width: number;
  surfaceType: string;
  gpPercent: number;
}

export interface WalkwayResults {
  totalLength: number;
  totalArea: number;
  sectionCosts: {
    [key: string]: {
      cost: number;
      labour: number;
    };
  };
  totalCost: number;
  salePrice: number;
  manDays: number;
}

const BASE_COST_PER_METER = 66.14;
const HANDRAIL_COSTS = {
  'none': 0,
  'one-side': 15.45,
  'two-sides': 30.90
};

const SURFACE_TYPE_MULTIPLIERS = {
  'Mesh': 1.0,
  'Solid': 1.2,
  'Perforated': 1.15
};

const LABOUR_RATE = 0.12;
const DEFAULT_GP_PERCENTAGE = 0.45;

export const calculateWalkway = (inputs: WalkwayInputs): WalkwayResults => {
  let totalLength = 0;
  const sectionCosts: { [key: string]: { cost: number; labour: number } } = {};
  let totalCost = 0;
  
  // Calculate each section
  inputs.sections.forEach(section => {
    if (section.active) {
      totalLength += section.length;
      
      // Base cost calculation
      let sectionCostPerMeter = BASE_COST_PER_METER;
      
      // Add handrail costs
      sectionCostPerMeter += HANDRAIL_COSTS[section.handrail];
      
      // Apply surface type multiplier
      sectionCostPerMeter *= SURFACE_TYPE_MULTIPLIERS[inputs.surfaceType as keyof typeof SURFACE_TYPE_MULTIPLIERS];
      
      const sectionBaseCost = section.length * sectionCostPerMeter / 1000; // Convert to meters
      const sectionLabourCost = sectionBaseCost * LABOUR_RATE;
      
      sectionCosts[section.name] = {
        cost: sectionBaseCost,
        labour: sectionLabourCost
      };
      
      totalCost += sectionBaseCost + sectionLabourCost;
    }
  });
  
  const totalArea = (totalLength * inputs.width) / 1000000; // Convert to m²
  const salePrice = totalCost / (1 - inputs.gpPercent);
  const manDays = Math.ceil(totalArea / 30); // Assume 30m² per day for walkways
  
  return {
    totalLength,
    totalArea,
    sectionCosts,
    totalCost,
    salePrice,
    manDays
  };
};