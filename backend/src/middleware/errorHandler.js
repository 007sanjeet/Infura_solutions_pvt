const errorHandler = (err, req, res, next) => {
  console.error('Unhandled API Error:', err);

  // Multer Error check
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  // Handle specific database errors or default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred.';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
