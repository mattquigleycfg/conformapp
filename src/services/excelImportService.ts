import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';

// Define calculation rule interfaces
interface CalculationRule {
  id: string;
  name: string;
  formula: string;
  description?: string;
}

interface MaterialFactor {
  category: string;
  factor: number;
}

export class ExcelImportService {
  /**
   * Imports calculation rules from an Excel file
   * @param {File|Buffer} excelFile - The Excel file to import
   */
  async importCalculationRules(excelFile: File | Buffer): Promise<CalculationRule[]> {
    try {
      // Read the Excel file
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      
      // Assume the rules are in a sheet named 'Calculation Rules'
      const rulesSheet = workbook.Sheets['Calculation Rules'] || workbook.Sheets[workbook.SheetNames[0]];
      
      if (!rulesSheet) {
        throw new Error('Could not find calculation rules sheet');
      }
      
      // Parse the sheet into JSON
      const rulesData = XLSX.utils.sheet_to_json(rulesSheet);
      
      // Transform the data into calculation rules
      const rules: CalculationRule[] = rulesData.map((row: any, index) => ({
        id: row.id || `rule_${index}`,
        name: row.name || `Rule ${index}`,
        formula: row.formula || '',
        description: row.description || ''
      }));
      
      // Store the rules in Supabase
      await this.storeCalculationRules(rules);
      
      return rules;
    } catch (error) {
      console.error('Error importing calculation rules:', error);
      throw error;
    }
  }
  
  /**
   * Stores calculation rules in Supabase
   * @param {CalculationRule[]} rules - The rules to store
   */
  private async storeCalculationRules(rules: CalculationRule[]): Promise<void> {
    try {
      // Create the calculation_rules table if it doesn't exist
      await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS calculation_rules (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            formula TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      // Insert the rules
      const { error } = await supabase
        .from('calculation_rules')
        .upsert(rules, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error storing calculation rules:', error);
      throw error;
    }
  }
  
  /**
   * Extracts material factors from the Excel file
   * @param {File|Buffer} excelFile - The Excel file to import
   */
  async extractMaterialFactors(excelFile: File | Buffer): Promise<MaterialFactor[]> {
    try {
      // Read the Excel file
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      
      // Assume the factors are in a sheet named 'Material Factors'
      const factorsSheet = workbook.Sheets['Material Factors'] || workbook.Sheets[workbook.SheetNames[1]];
      
      if (!factorsSheet) {
        throw new Error('Could not find material factors sheet');
      }
      
      // Parse the sheet into JSON
      const factorsData = XLSX.utils.sheet_to_json(factorsSheet);
      
      // Transform the data into material factors
      const factors: MaterialFactor[] = factorsData.map((row: any) => ({
        category: row.category || '',
        factor: parseFloat(row.factor) || 1.0
      })).filter(factor => factor.category);
      
      // Store the factors in Supabase
      await this.storeMaterialFactors(factors);
      
      return factors;
    } catch (error) {
      console.error('Error extracting material factors:', error);
      throw error;
    }
  }
  
  /**
   * Stores material factors in Supabase
   * @param {MaterialFactor[]} factors - The factors to store
   */
  private async storeMaterialFactors(factors: MaterialFactor[]): Promise<void> {
    try {
      // Create the material_factors table if it doesn't exist
      await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS material_factors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            category TEXT NOT NULL UNIQUE,
            factor DECIMAL(10,4) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      // Insert the factors
      for (const factor of factors) {
        const { error } = await supabase
          .from('material_factors')
          .upsert({ 
            category: factor.category,
            factor: factor.factor
          }, {
            onConflict: 'category',
            ignoreDuplicates: false
          });
        
        if (error) console.error(`Error storing factor for ${factor.category}:`, error);
      }
    } catch (error) {
      console.error('Error storing material factors:', error);
      throw error;
    }
  }
}

export const excelImportService = new ExcelImportService();
