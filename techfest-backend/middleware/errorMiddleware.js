/**
 * Request logger middleware.
 * Prints method, URL, and timestamp for every incoming request.
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

/**
 * 404 handler – placed after all routes.
 * Catches requests that didn't match any route.
 */
const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
};

/**
 * Central error handler – must have exactly four parameters.
 * Returns a consistent JSON error structure.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists.` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
};

module.exports = { requestLogger, notFound, errorHandler };

