/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: err.message || 'Internal Server Error',
    status: statusCode
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
