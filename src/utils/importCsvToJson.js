/**
 * Utility to convert the product CSV file to JSON 
 * This can be used for local development while waiting for repository access
 */
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Path to the CSV file - update this path as needed
const csvFilePath = path.resolve(__dirname, '../../../../Con-form Estimator v1.14.csv');
const outputFilePath = path.resolve(__dirname, '../data/products.json');

/**
 * Converts the CSV file to a JSON file
 */
function convertCsvToJson() {
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
    
    // Clean up and transform data
    const products = results.data
      .filter(row => row.Part && row.default_code) // Filter out empty rows
      .map(row => ({
        id: row.default_code,
        part_name: row.Part,
        product_code: row.default_code,
        standard_price: parseFloat(row.standard_price) || 0,
        weight: row.Weight ? parseFloat(row.Weight) : null,
        category: row.Category || null,
        comment: row.Comment || null,
        date_updated: row['Date updated'] ? new Date(row['Date updated']).toISOString() : null,
        manufactured_type: row.Manfufactured || null,
        unit_of_measure: row.UoM || 'Unit(s)',
        created_at: new Date().toISOString()
      }));
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the JSON file
    fs.writeFileSync(
      outputFilePath, 
      JSON.stringify(products, null, 2)
    );
    
    console.log(`Successfully converted CSV to JSON: ${outputFilePath}`);
    console.log(`Total products: ${products.length}`);
    
    return products;
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
    throw error;
  }
}

// Export functions for use in other files
module.exports = {
  convertCsvToJson
};

// Run the conversion if this file is executed directly
if (require.main === module) {
  convertCsvToJson();
}
