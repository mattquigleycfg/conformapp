const express = require('express');
const router = express.Router();
const calculationController = require('../controllers/calculationController');

// Route for all product calculations
router.post('/calculate', calculationController.calculateProduct);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
