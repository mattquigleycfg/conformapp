import { supabase } from '../supabaseClient';
import { BOMItem, BOMSummary } from './bomService';

// Interface for calculation input parameters
export interface CalculationParams {
  width: number;
  length: number;
  height?: number;
  loadRating?: number;
  flooring?: string;
  handrail?: boolean;
  location?: string;
  [key: string]: any;
}

// Interface for product with quantity calculation
interface ProductCalculation {
  productCode: string;
  quantityFormula: string;
  category: string;
  minQuantity?: number;
}

export class BOMCalculationService {
  /**
   * Evaluates a formula based on the provided parameters
   * @param {string} formula - The formula to evaluate
   * @param {CalculationParams} params - The parameters to use in the formula
   * @returns {number} The result of the formula evaluation
   */
  evaluateFormula(formula: string, params: CalculationParams): number {
    try {
      // Replace parameter placeholders with actual values
      let processedFormula = formula;
      
      // Replace parameter names with their values
      Object.keys(params).forEach(key => {
        const value = params[key];
        // Handle numeric values
        if (typeof value === 'number') {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          processedFormula = processedFormula.replace(regex, value.toString());
        }
        // Handle boolean values
        else if (typeof value === 'boolean') {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          processedFormula = processedFormula.replace(regex, value ? '1' : '0');
        }
      });
      
      // Handle common Excel functions
      processedFormula = this.replaceExcelFunctions(processedFormula);
      
      // Evaluate the formula
      // Using Function constructor with strict mode to evaluate the formula safely
      // This is generally not recommended due to security concerns, but for a trusted internal application it's acceptable
      const result = new Function('"use strict"; return ' + processedFormula)();
      
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', formula, error);
      return 0;
    }
  }
  
  /**
   * Replaces Excel functions with JavaScript equivalents
   * @param {string} formula - The formula containing Excel functions
   * @returns {string} The formula with JavaScript equivalents
   */
  private replaceExcelFunctions(formula: string): string {
    let result = formula;
    
    // Replace IF function
    result = result.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, 
      '($1 ? $2 : $3)');
    
    // Replace MAX function
    result = result.replace(/MAX\(([^)]+)\)/gi, 
      'Math.max($1)');
    
    // Replace MIN function
    result = result.replace(/MIN\(([^)]+)\)/gi, 
      'Math.min($1)');
    
    // Replace ROUND function
    result = result.replace(/ROUND\(([^,]+),([^)]+)\)/gi, 
      'Math.round($1 * Math.pow(10, $2)) / Math.pow(10, $2)');
    
    // Replace CEILING function
    result = result.replace(/CEILING\(([^,]+),([^)]+)\)/gi, 
      'Math.ceil($1 / $2) * $2');
    
    // Replace FLOOR function
    result = result.replace(/FLOOR\(([^,]+),([^)]+)\)/gi, 
      'Math.floor($1 / $2) * $2');
    
    // Replace SUM function - assuming comma-separated values
    result = result.replace(/SUM\(([^)]+)\)/gi, 
      '($1).reduce((a, b) => a + b, 0)');
    
    return result;
  }
  
  /**
   * Generates a BOM based on calculation rules and parameters
   * @param {string} productType - The type of product to generate a BOM for
   * @param {CalculationParams} params - The parameters to use in the calculations
   * @returns {Promise<BOMSummary>} The generated BOM
   */
  async generateBOM(productType: string, params: CalculationParams): Promise<BOMSummary> {
    try {
      // 1. Get the product calculation rules for this product type
      const calculationRules = await this.getProductCalculationRules(productType);
      
      // 2. Get the material factors
      const materialFactors = await this.getMaterialFactors();
      
      // 3. Calculate quantities for each product
      const bomItems: BOMItem[] = [];
      let itemNo = 1;
      
      for (const rule of calculationRules) {
        // Calculate the quantity
        const quantity = this.evaluateFormula(rule.quantityFormula, params);
        
        // Skip if quantity is zero or negative
        if (quantity <= 0) continue;
        
        // Get product details
        const product = await this.getProductDetails(rule.productCode);
        
        if (!product) {
          console.warn(`Product not found: ${rule.productCode}`);
          continue;
        }
        
        // Apply material factors if applicable
        const category = product.category || rule.category;
        const factor = category ? materialFactors[category] || 1.0 : 1.0;
        
        // Calculate the price with the factor
        const unitPrice = product.standard_price * factor;
        const totalPrice = unitPrice * quantity;
        
        // Add to BOM items
        bomItems.push({
          itemNo: itemNo++,
          productCode: product.product_code,
          description: product.part_name,
          quantity,
          unit: 'EA', // Default unit, could be stored in the product details
          unitPrice,
          totalPrice,
          category: category || 'Uncategorized',
          weight: product.weight ? product.weight * quantity : undefined
        });
      }
      
      // 4. Calculate totals
      const materialsCost = bomItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const labourCost = await this.calculateLabourCost(productType, bomItems, params);
      const consumablesCost = await this.calculateConsumablesCost(productType, materialsCost);
      const totalWeight = bomItems.reduce((sum, item) => sum + (item.weight || 0), 0);
      
      // 5. Create the BOM summary
      return {
        projectName: `${productType} ${params.width}x${params.length}`,
        productType,
        bomItems,
        subtotals: {
          materials: materialsCost,
          labour: labourCost,
          consumables: consumablesCost
        },
        totalCost: materialsCost + labourCost + consumablesCost,
        totalWeight,
        generatedDate: new Date()
      };
    } catch (error) {
      console.error('Error generating BOM:', error);
      throw error;
    }
  }
  
  /**
   * Gets product calculation rules for a specific product type
   * @param {string} productType - The product type
   * @returns {Promise<ProductCalculation[]>} The calculation rules
   */
  private async getProductCalculationRules(productType: string): Promise<ProductCalculation[]> {
    try {
      const { data, error } = await supabase
        .from('product_calculations')
        .select('*')
        .eq('product_type', productType);
      
      if (error) throw error;
      
      return data.map(rule => ({
        productCode: rule.product_code,
        quantityFormula: rule.quantity_formula,
        category: rule.category,
        minQuantity: rule.min_quantity
      }));
    } catch (error) {
      console.error('Error getting product calculation rules:', error);
      return [];
    }
  }
  
  /**
   * Gets material factors by category
   * @returns {Promise<Record<string, number>>} The material factors by category
   */
  private async getMaterialFactors(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('material_factors')
        .select('category, factor');
      
      if (error) throw error;
      
      // Convert to a record of category -> factor
      return data.reduce((acc, item) => {
        acc[item.category] = item.factor;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error getting material factors:', error);
      return {};
    }
  }
  
  /**
   * Gets product details by product code
   * @param {string} productCode - The product code
   * @returns {Promise<any>} The product details
   */
  private async getProductDetails(productCode: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_code', productCode)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error getting product details for ${productCode}:`, error);
      return null;
    }
  }
  
  /**
   * Calculates labour cost for a BOM
   * @param {string} productType - The product type
   * @param {BOMItem[]} items - The BOM items
   * @param {CalculationParams} params - The calculation parameters
   * @returns {Promise<number>} The labour cost
   */
  private async calculateLabourCost(
    productType: string, 
    items: BOMItem[], 
    params: CalculationParams
  ): Promise<number> {
    try {
      // Get labour rate
      const { data: rateData, error: rateError } = await supabase
        .from('labour_rates')
        .select('rate')
        .eq('product_type', productType)
        .single();
      
      if (rateError) {
        console.warn(`No specific labour rate found for ${productType}, using default`);
        // Use default rate
        const { data: defaultRate, error: defaultError } = await supabase
          .from('labour_rates')
          .select('rate')
          .eq('rate_type', 'default')
          .single();
        
        if (defaultError) {
          console.error('Error getting default labour rate:', defaultError);
          return 0;
        }
        
        const materialsCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
        return materialsCost * defaultRate.rate;
      }
      
      const materialsCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
      return materialsCost * rateData.rate;
    } catch (error) {
      console.error('Error calculating labour cost:', error);
      return 0;
    }
  }
  
  /**
   * Calculates consumables cost for a BOM
   * @param {string} productType - The product type
   * @param {number} materialsCost - The total materials cost
   * @returns {Promise<number>} The consumables cost
   */
  private async calculateConsumablesCost(
    productType: string, 
    materialsCost: number
  ): Promise<number> {
    try {
      // Get consumables rate
      const { data: rateData, error: rateError } = await supabase
        .from('consumable_rates')
        .select('rate')
        .eq('product_type', productType)
        .single();
      
      if (rateError) {
        console.warn(`No specific consumable rate found for ${productType}, using default`);
        // Use default rate
        const { data: defaultRate, error: defaultError } = await supabase
          .from('consumable_rates')
          .select('rate')
          .eq('rate_type', 'default')
          .single();
        
        if (defaultError) {
          console.error('Error getting default consumable rate:', defaultError);
          return 0;
        }
        
        return materialsCost * defaultRate.rate;
      }
      
      return materialsCost * rateData.rate;
    } catch (error) {
      console.error('Error calculating consumables cost:', error);
      return 0;
    }
  }
}

export const bomCalculationService = new BOMCalculationService();
