const excelService = require('../services/excelService');

/**
 * Calculate product dimensions and costs
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.calculateProduct = async (req, res) => {
  try {
    const { productType, params } = req.body;
    
    if (!productType || !params) {
      return res.status(400).json({ error: 'Missing productType or params' });
    }
    
    console.log(`Calculation request received for ${productType}`, params);
    
    // Process calculation through Excel service
    const result = await excelService.calculateProduct(productType, params);
    
    // Return results
    console.log(`Calculation completed for ${productType}`);
    res.json(result);
  } catch (error) {
    console.error(`Calculation error:`, error);
    
    // Format error response
    const errorResponse = {
      error: 'Calculation failed', 
      details: error.message
    };
    
    if (error.rawOutput) {
      errorResponse.rawOutput = error.rawOutput;
    }
    
    res.status(500).json(errorResponse);
  }
};
