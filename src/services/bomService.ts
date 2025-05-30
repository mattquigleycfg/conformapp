import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';

export interface BOMItem {
  itemNo: number;
  productCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: string;
  weight?: number;
}

export interface BOMSummary {
  id?: string;
  projectName: string;
  productType: string;
  bomItems: BOMItem[];
  subtotals: {
    materials: number;
    labour: number;
    consumables: number;
  };
  totalCost: number;
  totalWeight: number;
  generatedDate: Date;
}

export interface EasyMechMRInputs {
  width: number;
  length: number;
  height?: number;
  loadRating: number;
  flooring: 'Mesh' | 'Plank';
  handrail: boolean;
  location: string;
}

export interface SpanPlusInputs {
  width: number;
  length: number;
  height?: number;
  loadRating: number;
  hasMiddleBeam: boolean;
  location: string;
}

// Utility function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Utility function to format currency
const formatCurrency = (num: number): string => {
  return num.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
};

// Utility function to download a file
const downloadFile = (content: string, fileName: string, contentType: string): void => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export class BOMService {
  // Generate BOM based on product type and parameters
  async generateBOM(productType: string, parameters: any): Promise<BOMSummary> {
    switch(productType) {
      case 'EasyMech MR':
        return this.generateEasyMechMRBOM(parameters as EasyMechMRInputs);
      case 'Span+':
        return this.generateSpanPlusBOM(parameters as SpanPlusInputs);
      default:
        throw new Error(`Unsupported product type: ${productType}`);
    }
  }

  private async generateEasyMechMRBOM(params: EasyMechMRInputs): Promise<BOMSummary> {
    const items: BOMItem[] = [];
    
    // Platform structure items
    const platformArea = (params.width * params.length) / 1000000;
    
    // Mesh flooring
    if (params.flooring === 'Mesh') {
      items.push({
        itemNo: 1,
        productCode: 'CFGMESH',
        description: 'MESH FLOORING',
        quantity: platformArea,
        unit: 'm²',
        unitPrice: 169.73, // from material costs
        totalPrice: platformArea * 169.73,
        category: 'Mesh',
        weight: platformArea * 14
      });
    }
    
    // Support structure based on width/length
    const beamCount = Math.ceil(params.length / 1200);
    items.push({
      itemNo: 2,
      productCode: 'CFGRHS10050',
      description: 'RHS 100 X 50 X 3',
      quantity: beamCount * params.width / 1000,
      unit: 'm',
      unitPrice: 111.14,
      totalPrice: beamCount * params.width / 1000 * 111.14,
      category: 'Structure',
      weight: beamCount * params.width / 1000 * 14.2
    });
    
    // Posts based on area and load rating
    const postSpacing = params.loadRating === 5 ? 2400 : 3000;
    const postCount = Math.ceil(params.width / postSpacing) * Math.ceil(params.length / postSpacing);
    
    items.push({
      itemNo: 3,
      productCode: 'CFGPOST',
      description: 'POST - GALVANIZED',
      quantity: postCount,
      unit: 'EA',
      unitPrice: 55.93,
      totalPrice: postCount * 55.93,
      category: 'Structure',
      weight: postCount * 7.044
    });
    
    // Add handrail if specified
    if (params.handrail) {
      const perimeterLength = 2 * (params.width + params.length) / 1000;
      
      items.push({
        itemNo: 4,
        productCode: 'CFGHANDRAIL',
        description: 'HANDRAIL SYSTEM',
        quantity: perimeterLength,
        unit: 'm',
        unitPrice: 87.45,
        totalPrice: perimeterLength * 87.45,
        category: 'Handrail',
        weight: perimeterLength * 5.2
      });
    }
    
    // Calculate labour and consumables
    const materialsCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const labourCost = materialsCost * 0.12; // 12% of materials
    const consumablesCost = materialsCost * 0.05; // 5% of materials
    
    return {
      projectName: `Platform ${params.width}x${params.length}`,
      productType: 'EasyMech MR',
      bomItems: items,
      subtotals: {
        materials: materialsCost,
        labour: labourCost,
        consumables: consumablesCost
      },
      totalCost: materialsCost + labourCost + consumablesCost,
      totalWeight: items.reduce((sum, item) => sum + (item.weight || 0), 0),
      generatedDate: new Date()
    };
  }

  private async generateSpanPlusBOM(params: SpanPlusInputs): Promise<BOMSummary> {
    const items: BOMItem[] = [];
    
    // Platform structure items
    const platformArea = (params.width * params.length) / 1000000;
    
    // Standard flooring for Span+
    items.push({
      itemNo: 1,
      productCode: 'CFGPLANK',
      description: 'ALUMINIUM PLANK FLOORING',
      quantity: platformArea,
      unit: 'm²',
      unitPrice: 195.60,
      totalPrice: platformArea * 195.60,
      category: 'Flooring',
      weight: platformArea * 9.8
    });
    
    // Main beams
    const mainBeamLength = params.width / 1000;
    const mainBeamCount = Math.ceil(params.length / 1800) + 1;
    
    items.push({
      itemNo: 2,
      productCode: 'CFGSPANBEAM',
      description: 'SPAN+ MAIN BEAM',
      quantity: mainBeamCount * mainBeamLength,
      unit: 'm',
      unitPrice: 135.22,
      totalPrice: mainBeamCount * mainBeamLength * 135.22,
      category: 'Structure',
      weight: mainBeamCount * mainBeamLength * 7.8
    });
    
    // Middle beam if required
    if (params.hasMiddleBeam) {
      const middleBeamLength = params.length / 1000;
      
      items.push({
        itemNo: 3,
        productCode: 'CFGSPANMID',
        description: 'SPAN+ MIDDLE BEAM',
        quantity: middleBeamLength,
        unit: 'm',
        unitPrice: 122.75,
        totalPrice: middleBeamLength * 122.75,
        category: 'Structure',
        weight: middleBeamLength * 6.4
      });
    }
    
    // Legs based on area and load rating
    const legSpacing = params.loadRating === 5 ? 1800 : 2400;
    const legCount = Math.ceil(params.width / legSpacing) * Math.ceil(params.length / legSpacing);
    const legHeight = params.height || 1000; // Default height if not specified
    
    items.push({
      itemNo: params.hasMiddleBeam ? 4 : 3,
      productCode: 'CFGSPANLEG',
      description: 'SPAN+ ADJUSTABLE LEG',
      quantity: legCount,
      unit: 'EA',
      unitPrice: 78.45 + (legHeight / 1000 * 45.20), // Base price + height factor
      totalPrice: legCount * (78.45 + (legHeight / 1000 * 45.20)),
      category: 'Structure',
      weight: legCount * (2.1 + (legHeight / 1000 * 1.8))
    });
    
    // Calculate labour and consumables
    const materialsCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const labourCost = materialsCost * 0.10; // 10% of materials for Span+
    const consumablesCost = materialsCost * 0.03; // 3% of materials for Span+
    
    return {
      projectName: `Span+ Platform ${params.width}x${params.length}`,
      productType: 'Span+',
      bomItems: items,
      subtotals: {
        materials: materialsCost,
        labour: labourCost,
        consumables: consumablesCost
      },
      totalCost: materialsCost + labourCost + consumablesCost,
      totalWeight: items.reduce((sum, item) => sum + (item.weight || 0), 0),
      generatedDate: new Date()
    };
  }

  // Save BOM to database
  async saveBOM(bom: BOMSummary, createdBy: string): Promise<string> {
    const { data, error } = await supabase.from('project_boms').insert({
      project_name: bom.projectName,
      product_type: bom.productType,
      parameters: {}, // This should be filled with the actual parameters
      bom_items: bom.bomItems,
      total_cost: bom.totalCost,
      created_by: createdBy
    }).select('id');
    
    if (error) throw new Error(`Failed to save BOM: ${error.message}`);
    return data[0].id;
  }

  // Get BOM by ID
  async getBOMById(id: string): Promise<BOMSummary | null> {
    const { data, error } = await supabase
      .from('project_boms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(`Failed to get BOM: ${error.message}`);
    if (!data) return null;
    
    return {
      id: data.id,
      projectName: data.project_name,
      productType: data.product_type,
      bomItems: data.bom_items,
      subtotals: {
        materials: data.bom_items.reduce((sum: number, item: BOMItem) => sum + item.totalPrice, 0),
        labour: 0, // These would need to be stored or calculated
        consumables: 0
      },
      totalCost: data.total_cost,
      totalWeight: data.bom_items.reduce((sum: number, item: BOMItem) => sum + (item.weight || 0), 0),
      generatedDate: new Date(data.created_at)
    };
  }

  // Get all BOMs
  async getAllBOMs(): Promise<BOMSummary[]> {
    const { data, error } = await supabase
      .from('project_boms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to get BOMs: ${error.message}`);
    
    return data.map(item => ({
      id: item.id,
      projectName: item.project_name,
      productType: item.product_type,
      bomItems: item.bom_items,
      subtotals: {
        materials: 0, // Would need to calculate or store these
        labour: 0,
        consumables: 0
      },
      totalCost: item.total_cost,
      totalWeight: item.bom_items.reduce((sum: number, item: BOMItem) => sum + (item.weight || 0), 0),
      generatedDate: new Date(item.created_at)
    }));
  }

  // Export BOM to CSV
  async exportToCSV(bom: BOMSummary): Promise<string> {
    const headers = ['Item No', 'Product Code', 'Description', 'Quantity', 'Unit', 'Unit Price', 'Total Price', 'Category'];
    const rows = bom.bomItems.map(item => [
      item.itemNo,
      item.productCode,
      item.description,
      item.quantity,
      item.unit,
      item.unitPrice,
      item.totalPrice,
      item.category
    ]);
    
    // Add summary rows
    rows.push([]);
    rows.push(['', '', '', '', '', 'Materials', bom.subtotals.materials, '']);
    rows.push(['', '', '', '', '', 'Labour', bom.subtotals.labour, '']);
    rows.push(['', '', '', '', '', 'Consumables', bom.subtotals.consumables, '']);
    rows.push(['', '', '', '', '', 'Total', bom.totalCost, '']);
    
    // Use Papa Parse to generate CSV
    return Papa.unparse({
      fields: headers,
      data: rows
    });
  }

  // Export BOM to Excel
  async exportToExcel(bom: BOMSummary): Promise<ArrayBuffer> {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create BOM sheet
    const bomData = bom.bomItems.map(item => ({
      'Item No': item.itemNo,
      'Product Code': item.productCode,
      'Description': item.description,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Unit Price': item.unitPrice,
      'Total Price': item.totalPrice,
      'Category': item.category,
      'Weight (kg)': item.weight || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(bomData);
    XLSX.utils.book_append_sheet(wb, ws, 'BOM Items');
    
    // Create summary sheet
    const summaryData = [
      ['Project Name', bom.projectName],
      ['Product Type', bom.productType],
      ['Generated Date', format(bom.generatedDate, 'yyyy-MM-dd HH:mm:ss')],
      [''],
      ['Cost Summary'],
      ['Materials', bom.subtotals.materials],
      ['Labour', bom.subtotals.labour],
      ['Consumables', bom.subtotals.consumables],
      ['Total Cost', bom.totalCost],
      [''],
      ['Total Weight (kg)', bom.totalWeight]
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary');
    
    // Convert to buffer
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }
}

export const bomService = new BOMService();
