const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Cloudinary configuration missing:', missing.join(', '));
    console.warn('   File uploads will fail without proper Cloudinary configuration.');
    return false;
  }
  
  console.log('✅ Cloudinary configured successfully');
  return true;
};

// Cloudinary upload utility functions
const cloudinaryUtils = {
  // Upload image to Cloudinary
  uploadImage: async (filePath, options = {}) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'hire-learn',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      });
      return result;
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (filePaths, options = {}) => {
    try {
      const uploadPromises = filePaths.map(filePath => 
        cloudinary.uploader.upload(filePath, {
          folder: 'hire-learn',
          resource_type: 'auto',
          ...options
        })
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('❌ Cloudinary multiple upload error:', error);
      throw new Error(`Multiple image upload failed: ${error.message}`);
    }
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  },

  // Extract public ID from Cloudinary URL
  getPublicIdFromUrl: (url) => {
    if (!url) return null;
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  }
};

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hire-learn',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
    resource_type: 'auto',
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' },
      { format: 'auto' }
    ]
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images and documents are allowed.`), false);
  }
};

// Configure Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: fileFilter
});

// Middleware for different upload types
const uploadMiddleware = {
  // Single image upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple images upload
  array: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Multiple fields upload
  fields: (fields) => upload.fields(fields),
  
  // Any file upload (less restrictive)
  any: () => upload.any()
};

// Export configuration and utilities
module.exports = {
  cloudinary,
  uploadMiddleware,
  cloudinaryUtils,
  validateCloudinaryConfig,
  storage
};