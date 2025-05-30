const fs = require('fs');
const path = require('path');

/**
 * Utility for managing temporary files
 */
class TempFileManager {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.init();
  }

  /**
   * Initialize the temp directory
   */
  init() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Create a temporary file
   * @param {string} content - The content to write to the file
   * @param {string} extension - The file extension (default: .tmp)
   * @returns {string} - The path to the created temp file
   */
  createTempFile(content, extension = '.tmp') {
    const tempFilePath = path.join(this.tempDir, `temp_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, content);
    return tempFilePath;
  }

  /**
   * Delete a temporary file
   * @param {string} filePath - The path to the file to delete
   * @returns {boolean} - Whether the deletion was successful
   */
  deleteTempFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete temp file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Clean up old temporary files
   * @param {number} maxAge - Maximum age in milliseconds (default: 1 hour)
   */
  cleanupOldFiles(maxAge = 60 * 60 * 1000) {
    try {
      const files = fs.readdirSync(this.tempDir);
      const now = Date.now();
      
      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than maxAge
        if (now - stats.mtimeMs > maxAge) {
          this.deleteTempFile(filePath);
        }
      });
    } catch (error) {
      console.error('Error cleaning up old temp files:', error);
    }
  }
}

module.exports = new TempFileManager();
