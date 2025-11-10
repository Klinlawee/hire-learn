const multer = require('multer');
const path = require('path');
const { cloudinaryUtils } = require('../config/cloudinary');

// Configure multer for local storage (fallback if Cloudinary fails)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp_uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedMimeTypes = {
    images: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    videos: [
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/quicktime'
    ]
  };

  const allAllowedTypes = [
    ...allowedMimeTypes.images,
    ...allowedMimeTypes.documents,
    ...allowedMimeTypes.videos
  ];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, documents, and videos are allowed.`), false);
  }
};

// Configure multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum number of files
  },
  fileFilter: fileFilter
});

// Middleware for different upload scenarios
exports.uploadSingle = (fieldName, fileType = 'any') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE || 10 * 1024 * 1024} bytes.`
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files.'
          });
        }
        
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Unexpected field: ${err.field}. Expected: ${fieldName}.`
          });
        }
        
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        // Other errors (file filter, etc.)
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // File validation based on type
      if (req.file && fileType !== 'any') {
        const validationError = validateFileType(req.file, fileType);
        if (validationError) {
          return res.status(400).json({
            success: false,
            message: validationError
          });
        }
      }
      
      next();
    });
  };
};

exports.uploadMultiple = (fieldName, maxCount = 5, fileType = 'any') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `One or more files are too large. Maximum size is ${process.env.MAX_FILE_SIZE || 10 * 1024 * 1024} bytes.`
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum allowed: ${maxCount}.`
          });
        }
        
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // Validate all files if specific type required
      if (req.files && fileType !== 'any') {
        for (const file of req.files) {
          const validationError = validateFileType(file, fileType);
          if (validationError) {
            return res.status(400).json({
              success: false,
              message: validationError
            });
          }
        }
      }
      
      next();
    });
  };
};

exports.uploadFields = (fields, fileType = 'any') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `One or more files are too large. Maximum size is ${process.env.MAX_FILE_SIZE || 10 * 1024 * 1024} bytes.`
          });
        }
        
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      next();
    });
  };
};

// Helper function to validate file type
const validateFileType = (file, expectedType) => {
  const typeCategories = {
    image: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/svg+xml'
    ],
    document: [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    video: [
      'video/mp4', 'video/mpeg', 'video/ogg', 
      'video/webm', 'video/quicktime'
    ],
    resume: [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  const allowedTypes = typeCategories[expectedType];
  
  if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
    return `Invalid file type for ${expectedType}. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Middleware to clean up uploaded files after request is complete
exports.cleanupUploads = (req, res, next) => {
  // Store the original send function
  const originalSend = res.send;
  
  // Override the send function to clean up files after response
  res.send = function(data) {
    // Clean up uploaded files if they exist
    if (req.files) {
      cleanupFiles(req.files);
    } else if (req.file) {
      cleanupFiles([req.file]);
    }
    
    // Call the original send function
    originalSend.call(this, data);
  };
  
  next();
};

// Helper function to delete files from local storage
const cleanupFiles = (files) => {
  const fs = require('fs');
  const path = require('path');
  
  if (Array.isArray(files)) {
    files.forEach(file => {
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
          console.log(`Cleaned up temporary file: ${file.path}`);
        } catch (error) {
          console.error(`Error cleaning up file ${file.path}:`, error);
        }
      }
    });
  } else if (files && files.path && fs.existsSync(files.path)) {
    try {
      fs.unlinkSync(files.path);
      console.log(`Cleaned up temporary file: ${files.path}`);
    } catch (error) {
      console.error(`Error cleaning up file ${files.path}:`, error);
    }
  }
};

// Middleware to validate file presence
exports.requireFile = (fieldName) => {
  return (req, res, next) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: `File is required for field: ${fieldName}`
      });
    }
    next();
  };
};

// Middleware to get upload progress (for large files)
exports.uploadProgress = (req, res, next) => {
  let progress = 0;
  
  req.on('data', (chunk) => {
    progress += chunk.length;
    const contentLength = req.headers['content-length'];
    
    if (contentLength) {
      const percentage = Math.round((progress / contentLength) * 100);
      
      // Emit progress event (could be used with WebSockets for real-time updates)
      req.uploadProgress = percentage;
      
      // Log progress for debugging
      if (percentage % 25 === 0) {
        console.log(`Upload progress: ${percentage}%`);
      }
    }
  });
  
  next();
};