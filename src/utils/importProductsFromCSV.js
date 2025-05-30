import { createProductsTable, importProductsFromCSV } from './createProductsTable';
import path from 'path';

// CSV file path - adjust this to the location of your CSV file
const csvFilePath = path.resolve(__dirname, '../../../Con-form Estimator v1.14.csv');

// Run the import process
async function runImport() {
  console.log('Creating products table...');
  await createProductsTable();
  
  console.log('Importing products from CSV...');
  await importProductsFromCSV(csvFilePath);
  
  console.log('Import process completed');
}

runImport().catch(err => {
  console.error('Error during import process:', err);
  process.exit(1);
});
