const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const path = require('path');
const fs = require('fs');
const calculationRoutes = require('./routes/calculationRoutes');
const errorHandler = require('./middleware/errorHandler');

// Create app
const app = express();
const port = process.env.PORT || 3000;

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Basic authentication
app.use(basicAuth({
  users: { 'admin': 'Prevent12345' },
  challenge: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Routes
app.use('/api', calculationRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://4.198.105.241:${port}`);
});
cd "C:\Users\Matt\Con-form Group Dropbox\Matt Quigley\PC\Desktop\Projects\conformApp\project\src\services\excelCalculationServer"
npm install
node server.jscd "C:\Users\Matt\Con-form Group Dropbox\Matt Quigley\PC\Desktop\Projects\conformApp\project\src\services\excelCalculationServer"
npm install
node server.js