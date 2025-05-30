export interface SpanPlusInputs {
  pitch: number;
  width: number;
  rafterSpacing: number;
  totalLength: number;
  bays: number;
  kit: boolean;
  stubSpacing: number;
  startHeight: number;
  loadRating: number;
  location: string;
  gpPercent: number;
}

export interface SpanPlusResults {
  platformArea: number;
  screenArea: number;
  endHeight: number;
  platformWeight: number;
  manDays: number;
  costs: {
    platform: number;
    productionLabour: number;
    engineeringLabour: number;
    packaging: number;
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
const PACKAGING_RATE = 0.02; // 2% for Span+
const PLATFORM_WEIGHT_PER_SQM = 17; // 17 kg/m² for Span+
const DEFAULT_GP_PERCENTAGE = 0.45;

export const calculateSpanPlus = (inputs: SpanPlusInputs): SpanPlusResults => {
  // Platform Area: Width × Total Length / 1,000,000
  const platformArea = (inputs.width * inputs.totalLength) / 1000000;
  
  // Screen Area calculation (from Excel pattern)
  const screenArea = platformArea * 2.074; // Approximate multiplier from Excel
  
  // End Height: (TAN(RADIANS(Pitch)) × Width) + Start Height
  const endHeight = (Math.tan(inputs.pitch * Math.PI / 180) * inputs.width) + inputs.startHeight;
  
  // Platform Weight: Area × 17 kg/m²
  const platformWeight = platformArea * PLATFORM_WEIGHT_PER_SQM;
  
  // Platform cost (placeholder - would come from BoM)
  const platformCost = platformArea * 472.75; // From Excel pattern
  
  // Labour calculations
  const productionLabour = platformCost * (inputs.kit ? LABOUR_RATES.production.kit : LABOUR_RATES.production.noKit);
  const engineeringLabour = platformCost * (inputs.kit ? LABOUR_RATES.engineering.kit : LABOUR_RATES.engineering.noKit);
  
  // Other costs
  const packaging = platformCost * PACKAGING_RATE;
  const cogsRunningCosts = platformCost * COGS_RUNNING_COST_RATE;
  
  const subTotal = platformCost + productionLabour + engineeringLabour + packaging + cogsRunningCosts;
  const contingency = calculateContingency(inputs.location, inputs.loadRating, subTotal, platformArea);
  const grandTotal = subTotal + contingency;
  
  // Sale prices
  const platformSalePrice = grandTotal / (1 - DEFAULT_GP_PERCENTAGE);
  const labourSalePrice = (productionLabour + engineeringLabour) / (1 - DEFAULT_GP_PERCENTAGE);
  
  // Man days from Labour sheet
  const manDays = Math.ceil(screenArea / 40);
  
  return {
    platformArea,
    screenArea,
    endHeight,
    platformWeight,
    manDays,
    costs: {
      platform: platformCost,
      productionLabour,
      engineeringLabour,
      packaging,
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