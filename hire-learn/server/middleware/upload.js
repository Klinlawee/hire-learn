import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Cloudinary storage for images
const cloudinaryImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hire-learn/images',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return 'image-' + uniqueSuffix
    },
  },
})

// Cloudinary storage for documents
const cloudinaryDocStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hire-learn/documents',
    format: async (req, file) => {
      // Preserve original format for documents
      const ext = path.extname(file.originalname).toLowerCase()
      return ext.substring(1) // remove the dot
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return 'doc-' + uniqueSuffix
    },
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Check file types
  if (file.mimetype.startsWith('image/')) {
    // Images
    if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'), false)
    }
  } else if (file.mimetype === 'application/pdf' ||
             file.mimetype === 'application/msword' ||
             file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Documents
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false)
  }
}

// Create upload instances
export const uploadImage = multer({
  storage: cloudinaryImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  },
  fileFilter: fileFilter
})

export const uploadDocument = multer({
  storage: cloudinaryDocStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for documents
  },
  fileFilter: fileFilter
})

// Default export (for backward compatibility)
export default uploadDocument