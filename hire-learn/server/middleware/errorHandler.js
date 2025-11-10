const { validationResult } = require('express-validator');

// @desc    Centralized error handling middleware
// @access  Global
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    code: err.code,
    keyValue: err.keyValue,
    errors: err.errors
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404,
      name: 'NotFoundError'
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} '${value}' already exists. Please use a different ${field}.`;
    error = {
      message,
      statusCode: 400,
      name: 'DuplicateFieldError'
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation failed: ${messages.join(', ')}`;
    error = {
      message,
      statusCode: 400,
      name: 'ValidationError',
      details: messages
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.';
    error = {
      message,
      statusCode: 401,
      name: 'AuthenticationError'
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please login again.';
    error = {
      message,
      statusCode: 401,
      name: 'AuthenticationError'
    };
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    let statusCode = 400;

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size is ${process.env.MAX_FILE_SIZE || 10 * 1024 * 1024} bytes.`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field in file upload.';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts in form data.';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name too long.';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value too long.';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields in form data.';
        break;
      default:
        message = `File upload error: ${err.message}`;
    }

    error = {
      message,
      statusCode,
      name: 'FileUploadError'
    };
  }

  // Cloudinary errors
  if (err.message && err.message.includes('Cloudinary')) {
    error = {
      message: 'File upload service error. Please try again.',
      statusCode: 500,
      name: 'CloudinaryError'
    };
  }

  // Express validator errors
  if (err.array && typeof err.array === 'function') {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = 'Validation failed';
      const details = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }));

      error = {
        message,
        statusCode: 400,
        name: 'RequestValidationError',
        details
      };
    }
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Don't leak error details in production
  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = err;
    response.stack = err.stack;
    
    if (error.details) {
      response.details = error.details;
    }
  } else {
    // Log full error in production (but don't send to client)
    console.error('Production Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user ? req.user.id : 'Unauthenticated'
    });
  }

  // Special handling for 404 errors
  if (statusCode === 404) {
    response.message = message || 'Resource not found';
  }

  res.status(statusCode).json(response);
};

// @desc    404 handler for undefined routes
// @access  Global
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// @desc    Async handler to avoid try-catch blocks in controllers
// @access  Global
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Validation error formatter for express-validator
// @access  Global
const validationErrorFormatter = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// @desc    Security headers middleware
// @access  Global
const securityHeaders = (req, res, next) => {
  // Remove potentially sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (adjust based on your needs)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );

  next();
};

// @desc    Request logging middleware
// @access  Global
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user ? req.user.id : 'Unauthenticated'
    });
  });

  next();
};

// @desc    Rate limiting error handler
// @access  Global
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(process.env.RATE_LIMIT_WINDOW_MS / 1000) || 15
  });
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  validationErrorFormatter,
  securityHeaders,
  requestLogger,
  rateLimitHandler
};