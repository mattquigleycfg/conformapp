import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import ExcelJS from 'exceljs';

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://conformgroup.netlify.app']
    : ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

const ODOO_BASE_URL = 'https://con-formgroup.odoo.com';
const API_KEY = '22bd2c86d9265422d7fe93d535a713a7e245c2d0';

// Process Excel file
app.post('/api/process-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const result = {
      sheets: {},
      formulas: {},
      namedRanges: {}
    };

    // Process each worksheet
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetData = [];
      
      // Get worksheet data
      worksheet.eachRow((row, rowNumber) => {
        const rowData = [];
        row.eachCell((cell, colNumber) => {
          rowData.push({
            value: cell.value,
            formula: cell.formula,
            type: cell.type
          });
        });
        sheetData.push(rowData);
      });

      result.sheets[worksheet.name] = sheetData;

      // Get named ranges in the worksheet
      const ranges = worksheet.getNames();
      if (ranges.length > 0) {
        result.namedRanges[worksheet.name] = ranges.map(range => ({
          name: range.name,
          range: range.range
        }));
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Excel processing error:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// Proxy route for Odoo authentication
app.get('/api/auth/token', async (req, res) => {
  try {
    const response = await axios.get(`${ODOO_BASE_URL}/web/session/authenticate`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Odoo auth error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to authenticate with Odoo'
    });
  }
});

// Proxy route for BOM creation
app.post('/api/v1/bom/create', async (req, res) => {
  try {
    const response = await axios.post(
      `${ODOO_BASE_URL}/api/v1/bom/create`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('BOM creation error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to create BOM'
    });
  }
});

// Proxy route for work order creation
app.post('/api/v1/manufacturing/create', async (req, res) => {
  try {
    const response = await axios.post(
      `${ODOO_BASE_URL}/api/v1/manufacturing/create`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Work order creation error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Failed to create work order'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});