const express = require('express');
const router = express.Router();
const { uploadMiddleware, cloudinaryUtils, validateCloudinaryConfig } = require('../config/cloudinary');
const auth = require('../middleware/auth');

// Single image upload route
router.post('/image', auth, uploadMiddleware.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple images upload route
router.post('/images', auth, uploadMiddleware.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      format: file.format,
      size: file.size
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete image route
router.delete('/image/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinaryUtils.deleteImage(publicId);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;