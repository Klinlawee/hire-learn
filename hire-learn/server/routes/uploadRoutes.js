const express = require('express');
const router = express.Router();

// Import middleware
const auth = require('../middleware/auth');
const { uploadMiddleware, cloudinaryUtils } = require('../config/cloudinary');

// Routes for file uploads
router.post('/image', 
  auth, 
  uploadMiddleware.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: req.file.path,
          publicId: req.file.filename,
          format: req.file.format,
          size: req.file.size,
          resourceType: req.file.resource_type
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: error.message
      });
    }
  }
);

router.post('/images', 
  auth, 
  uploadMiddleware.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        format: file.format,
        size: file.size,
        resourceType: file.resource_type
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} images uploaded successfully`,
        data: uploadedFiles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: error.message
      });
    }
  }
);

router.post('/document', 
  auth, 
  uploadMiddleware.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          url: req.file.path,
          publicId: req.file.filename,
          format: req.file.format,
          size: req.file.size,
          originalName: req.file.originalname,
          resourceType: req.file.resource_type
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: error.message
      });
    }
  }
);

router.delete('/image/:publicId', 
  auth,
  async (req, res) => {
    try {
      const { publicId } = req.params;
      
      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      const result = await cloudinaryUtils.deleteImage(publicId);
      
      if (result.result === 'ok') {
        res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Delete failed',
        error: error.message
      });
    }
  }
);

// Health check for upload service
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;