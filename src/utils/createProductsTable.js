import { supabase } from '../supabaseClient';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

/**
 * Creates the products table in Supabase
 */
export const createProductsTable = async () => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          part_name TEXT NOT NULL,
          product_code TEXT UNIQUE,
          standard_price DECIMAL(10,2),
          weight DECIMAL(10,2),
          category TEXT,
          comment TEXT,
          date_updated TIMESTAMP,
          manufactured_type TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_product_code ON products(product_code);
        CREATE INDEX IF NOT EXISTS idx_category ON products(category);
      `
    });

    if (error) throw error;
    console.log('Products table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating products table:', error);
    return false;
  }
};

/**
 * Imports product data from the CSV file into the Supabase products table
 * @param {string} csvFilePath - Path to the CSV file
 */
export const importProductsFromCSV = async (csvFilePath) => {
  try {
    // Read the CSV file
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV data
    const results = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true
    });
    
    if (results.errors.length > 0) {
      console.error('CSV parsing errors:', results.errors);
    }
    
    const products = results.data.map(row => ({
      part_name: row.Part || '',
      product_code: row.default_code || '',
      standard_price: parseFloat(row.standard_price) || 0,
      weight: row.Weight ? parseFloat(row.Weight) : null,
      category: row.Category || null,
      comment: row.Comment || null,
      date_updated: row['Date updated'] ? new Date(row['Date updated']).toISOString() : null,
      manufactured_type: row.Manufactured || null
    })).filter(product => product.part_name && product.product_code);
    
    // Insert data in batches of 100 to avoid request size limits
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .upsert(batch, { 
          onConflict: 'product_code',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`Error importing batch ${i}-${i+batchSize}:`, error);
      } else {
        console.log(`Imported batch ${i}-${i+batchSize} successfully`);
      }
    }
    
    console.log(`Imported ${products.length} products successfully`);
    return true;
  } catch (error) {
    console.error('Error importing products:', error);
    return false;
  }
};
