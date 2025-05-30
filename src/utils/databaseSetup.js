import { supabase } from '../supabaseClient';

export const setupBOMDatabase = async () => {
  try {
    // Create products table
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS products (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          part_name text NOT NULL,
          product_code text UNIQUE NOT NULL,
          standard_price decimal(10,2),
          weight decimal(10,2),
          category text,
          comment text,
          date_updated timestamp,
          manufactured_type text,
          created_at timestamp DEFAULT now(),
          updated_at timestamp DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      `
    });

    // Create material_costs table
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS material_costs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          part_name text NOT NULL,
          contingency_cost decimal(10,2),
          base_cost decimal(10,2) NOT NULL,
          weight_kg decimal(10,2),
          category text,
          date_updated timestamp,
          created_at timestamp DEFAULT now(),
          updated_at timestamp DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_material_costs_part ON material_costs(part_name);
      `
    });

    // Create labour_rates table
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS labour_rates (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          rate_type text NOT NULL,
          rate decimal(10,4) NOT NULL,
          effective_date date,
          created_at timestamp DEFAULT now()
        );
      `
    });

    // Create contingency_rates table
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS contingency_rates (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          load_rating decimal(3,1) NOT NULL,
          location_group text NOT NULL,
          min_rate decimal(10,2) NOT NULL,
          created_at timestamp DEFAULT now()
        );
      `
    });

    // Create project_boms table
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS project_boms (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          project_name text NOT NULL,
          product_type text NOT NULL,
          parameters jsonb NOT NULL,
          bom_items jsonb NOT NULL,
          total_cost decimal(10,2),
          created_by text,
          created_at timestamp DEFAULT now()
        );
      `
    });

    console.log('All BOM tables created successfully');
    return true;
  } catch (error) {
    console.error('Error setting up BOM database:', error);
    return false;
  }
};
