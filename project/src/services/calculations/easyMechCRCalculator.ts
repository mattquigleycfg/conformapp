export interface EasyMechCRInputs {
  width: number;
  length: number;
  flooring: string;
  loadRating: number;
  kit: boolean;
  location: string;
  gpPercent: number;
}

export interface EasyMechCRResults {
  platformArea: number;
  endHeight: number; // Fixed for CR
  platformWeight: number;
  manDays: number;
  costs: {
    platformCost: number;
    productionLabour: number;
    engineeringLabour: number;
    packagingConsumables: number;
    cogsRunningCosts: number;
    subTotal: number;
    contingency: number;
    grandTotal: number;
    gpPercentage: number;
    platformSalePrice: number;
    labourSalePrice: number;
    perSqmRate: number;
  };
}

const LABOUR_RATES = {
  production: { kit: 0.12, noKit: 0.12 },
  engineering: { kit: 0.064, noKit: 0.15 }
};

const COGS_RUNNING_COST_RATE = 0.026;
const PACKAGING_RATE = 0.01; // 1% for CR
const PLATFORM_WEIGHT_PER_SQM = 12; // 12 kg/m² for CR
const DEFAULT_GP_PERCENTAGE = 0.45;
const FIXED_END_HEIGHT = 824; // Fixed height for CR model

export const calculateEasyMechCR = (inputs: EasyMechCRInputs): EasyMechCRResults => {
  // Calculate platform area in m²
  const platformArea = (inputs.width * inputs.length) / 1000000;
  
  // Platform Weight: Area × 12 kg/m²
  const platformWeight = platformArea * PLATFORM_WEIGHT_PER_SQM;
  
  // Calculate base platform cost (simplified - would normally come from BoM)
  const platformCost = platformArea * 200; // Base rate per m²
  
  // Calculate labour costs
  const productionLabour = platformCost * (inputs.kit ? LABOUR_RATES.production.kit : LABOUR_RATES.production.noKit);
  const engineeringLabour = platformCost * (inputs.kit ? LABOUR_RATES.engineering.kit : LABOUR_RATES.engineering.noKit);
  
  // Calculate additional costs
  const packagingConsumables = platformCost * PACKAGING_RATE;
  const cogsRunningCosts = platformCost * COGS_RUNNING_COST_RATE;
  
  // Calculate subtotal
  const subTotal = platformCost + productionLabour + engineeringLabour + packagingConsumables + cogsRunningCosts;
  
  // Calculate contingency
  const contingency = calculateContingency(inputs.location, inputs.loadRating, subTotal, platformArea);
  
  // Calculate grand total
  const grandTotal = subTotal + contingency;
  
  // Calculate sale prices
  const platformSalePrice = grandTotal / (1 - DEFAULT_GP_PERCENTAGE);
  const labourSalePrice = (productionLabour + engineeringLabour) / (1 - DEFAULT_GP_PERCENTAGE);
  
  // Calculate man days (simplified - would normally be more complex)
  const manDays = Math.ceil(platformArea / 40); // Assume 40m² per day for CR
  
  return {
    platformArea,
    endHeight: FIXED_END_HEIGHT,
    platformWeight,
    manDays,
    costs: {
      platformCost,
      productionLabour,
      engineeringLabour,
      packagingConsumables,
      cogsRunningCosts,
      subTotal,
      contingency,
      grandTotal,
      gpPercentage: DEFAULT_GP_PERCENTAGE,
      platformSalePrice,
      labourSalePrice,
      perSqmRate: grandTotal / platformArea
    }
  };
};

function calculateContingency(location: string, loadRating: number, subtotal: number, area: number): number {
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
}