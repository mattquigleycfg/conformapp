export const calculateEndHeight = (pitch: number, width: number, startHeight: number): number => {
  return (Math.tan(pitch * Math.PI / 180) * width) + startHeight;
};

export const calculatePlatformWeight = (area: number): number => {
  return area * 14; // 14 kg per m²
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

export interface EasyMechMRInputs {
  pitch: number;
  width: number;
  length: number;
  startHeight: number;
  roofType: string;
  flooring: string;
  loadRating: number;
  kit: boolean;
  ridge: boolean;
  side1: number;
  side2: number;
  location: string;
}

export interface EasyMechMRResults {
  platformArea: number;
  endHeight: number;
  platformWeight: number;
  manDays: number;
  trussEndHeight: number;
  gapValidation: {
    isValid: boolean;
    message: string;
  };
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
const PACKAGING_RATE = 0.021;
const PLATFORM_WEIGHT_PER_SQM = 14;
const DEFAULT_GP_PERCENTAGE = 0.45;

export const calculateEasyMechMR = (inputs: EasyMechMRInputs): EasyMechMRResults => {
  // Calculate platform area in m²
  const platformArea = (inputs.width * inputs.length) / 1000000;
  
  // Calculate end height using trigonometry
  const endHeight = calculateEndHeight(inputs.pitch, inputs.width, inputs.startHeight);
  
  // Calculate platform weight
  const platformWeight = calculatePlatformWeight(platformArea);
  
  // Validate gap
  const gap = inputs.width - inputs.side1 - inputs.side2;
  const gapValidation = {
    isValid: gap > 1200,
    message: gap <= 1200 ? 'Gap must be greater than 1200mm' : ''
  };
  
  // Calculate base platform cost (simplified - would normally come from BoM)
  const platformCost = platformArea * 250; // Base rate per m²
  
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
  const manDays = Math.ceil(platformArea / 20); // Assume 20m² per day
  
  return {
    platformArea,
    endHeight,
    platformWeight,
    manDays,
    trussEndHeight: endHeight + 100, // Truss end height is end height plus 100mm
    gapValidation,
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