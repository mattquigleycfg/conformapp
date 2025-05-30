const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Service to handle Excel calculations via VBScript
 */
class ExcelService {
  constructor() {
    this.excelPath = "C:\\ExcelCalculationServer\\Con-form Estimator v1.14.xlsm";
    this.tempDir = path.join(__dirname, '../temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Calculate product dimensions and costs
   * @param {string} productType - The type of product to calculate
   * @param {object} params - The parameters for the calculation
   * @returns {Promise<object>} - The calculation results
   */
  async calculateProduct(productType, params) {
    // Create a VBS script to run Excel with parameters
    const vbsScript = this._createVbsScript(productType, params);
    
    // Write VBS to temp file
    const tempFile = path.join(this.tempDir, `temp_${Date.now()}.vbs`);
    fs.writeFileSync(tempFile, vbsScript);
    
    try {
      // Execute VBS
      console.log(`Executing VBS script for ${productType}`);
      const { stdout, stderr } = await execPromise(`cscript //NoLogo "${tempFile}"`);
      
      if (stderr) {
        console.error(`VBS stderr: ${stderr}`);
      }
      
      // Parse and return the results
      try {
        const result = JSON.parse(stdout.trim());
        return result;
      } catch (e) {
        console.error('Failed to parse results:', e);
        console.error('Raw output:', stdout);
        throw new Error('Failed to parse calculation results');
      }
    } catch (error) {
      console.error(`Error executing VBS: ${error.message}`);
      
      // Try to parse error from stdout if it's in JSON format
      try {
        const errorJson = JSON.parse(error.stdout.trim());
        if (errorJson.error) {
          throw new Error(errorJson.error);
        }
      } catch (e) {
        // If not JSON, just throw the raw error
      }
      
      throw new Error(`Excel calculation failed: ${error.message}`);
    } finally {
      // Clean up temp file
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (e) {
        console.error('Failed to delete temp file:', e);
      }
    }
  }

  /**
   * Create VBS script for Excel automation
   * @private
   * @param {string} productType - The type of product to calculate
   * @param {object} params - The parameters for the calculation
   * @returns {string} - The VBS script
   */
  _createVbsScript(productType, params) {
    return `
      On Error Resume Next
      
      Set excel = CreateObject("Excel.Application")
      
      If Err.Number <> 0 Then
        WScript.Echo "{""error"": ""Failed to create Excel application: " & Replace(Err.Description, """", "'") & """}"
        WScript.Quit 1
      End If
      
      excel.Visible = False
      excel.DisplayAlerts = False
      excel.EnableEvents = True
      
      Set wb = excel.Workbooks.Open("${this.excelPath}")
      
      If Err.Number <> 0 Then
        excel.Quit
        WScript.Echo "{""error"": ""Failed to open workbook: " & Replace(Err.Description, """", "'") & """}"
        WScript.Quit 1
      End If
      
      ' Set parameters
      excel.Run "SetInputs", "${productType}", "${JSON.stringify(params).replace(/"/g, '""')}"
      
      If Err.Number <> 0 Then
        wb.Close False
        excel.Quit
        WScript.Echo "{""error"": ""Failed to set inputs: " & Replace(Err.Description, """", "'") & """}"
        WScript.Quit 1
      End If
      
      ' Run calculation
      excel.Run "Calculate${productType}"
      
      If Err.Number <> 0 Then
        wb.Close False
        excel.Quit
        WScript.Echo "{""error"": ""Failed to calculate: " & Replace(Err.Description, """", "'") & """}"
        WScript.Quit 1
      End If
      
      ' Get results as JSON
      result = excel.Run("GetResults")
      
      If Err.Number <> 0 Then
        wb.Close False
        excel.Quit
        WScript.Echo "{""error"": ""Failed to get results: " & Replace(Err.Description, """", "'") & """}"
        WScript.Quit 1
      End If
      
      ' Clean up
      wb.Close False
      excel.Quit
      
      Set wb = Nothing
      Set excel = Nothing
      
      ' Output result
      WScript.Echo result
    `;
  }
}

module.exports = new ExcelService();
