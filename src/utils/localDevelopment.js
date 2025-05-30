/**
 * Local development utility for working with product data
 * while waiting for repository access
 */
const fs = require('fs');
const path = require('path');
const { convertCsvToJson } = require('./importCsvToJson');

// Path to the JSON file
const productsJsonPath = path.resolve(__dirname, '../data/products.json');

/**
 * Loads product data from JSON file or generates it from CSV
 * @returns {Array} Array of product objects
 */
function loadProductData() {
  try {
    // Check if JSON file exists
    if (fs.existsSync(productsJsonPath)) {
      // Read from existing JSON file
      const data = fs.readFileSync(productsJsonPath, 'utf8');
      return JSON.parse(data);
    } else {
      // Generate JSON from CSV
      console.log('Products JSON not found, generating from CSV...');
      return convertCsvToJson();
    }
  } catch (error) {
    console.error('Error loading product data:', error);
    return [];
  }
}

/**
 * Gets products by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered products
 */
function getProductsByCategory(category) {
  const products = loadProductData();
  return products.filter(product => product.category === category);
}

/**
 * Searches products by name or code
 * @param {string} query - Search query
 * @returns {Array} Matching products
 */
function searchProducts(query) {
  if (!query || query.trim() === '') return [];
  
  const products = loadProductData();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.part_name?.toLowerCase().includes(lowercaseQuery) || 
    product.product_code?.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Gets a product by code
 * @param {string} productCode - Product code to find
 * @returns {Object|null} The product or null if not found
 */
function getProductByCode(productCode) {
  const products = loadProductData();
  return products.find(product => product.product_code === productCode) || null;
}

/**
 * Calculates total weight for a set of products and quantities
 * @param {Array} items - Array of {productCode, quantity} objects
 * @returns {number} Total weight
 */
function calculateTotalWeight(items) {
  const products = loadProductData();
  
  return items.reduce((total, item) => {
    const product = products.find(p => p.product_code === item.productCode);
    if (product && product.weight) {
      return total + (product.weight * item.quantity);
    }
    return total;
  }, 0);
}

/**
 * Calculates total price for a set of products and quantities
 * @param {Array} items - Array of {productCode, quantity} objects
 * @returns {number} Total price
 */
function calculateTotalPrice(items) {
  const products = loadProductData();
  
  return items.reduce((total, item) => {
    const product = products.find(p => p.product_code === item.productCode);
    if (product && product.standard_price) {
      return total + (product.standard_price * item.quantity);
    }
    return total;
  }, 0);
}

module.exports = {
  loadProductData,
  getProductsByCategory,
  searchProducts,
  getProductByCode,
  calculateTotalWeight,
  calculateTotalPrice
};

// If executed directly, show a sample of the data
if (require.main === module) {
  const products = loadProductData();
  console.log(`Loaded ${products.length} products`);
  console.log('Sample of first 5 products:');
  console.log(JSON.stringify(products.slice(0, 5), null, 2));
  
  // Example search
  const searchResults = searchProducts('screen');
  console.log(`Found ${searchResults.length} products matching 'screen'`);
  
  // Example category filter
  const categories = [...new Set(products.filter(p => p.category).map(p => p.category))];
  console.log('Available categories:', categories);
}
