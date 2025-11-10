const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

// Import controllers
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  deactivateUser,
  reactivateUser
} = require('../controllers/userController');

// Import middleware
const auth = require('../middleware/auth');
const { uploadMiddleware } = require('../config/cloudinary');

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('profile.phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  
  body('role')
    .optional()
    .isIn(['admin', 'employer', 'employee'])
    .withMessage('Role must be admin, employer, or employee'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['admin', 'employer', 'employee'])
    .withMessage('Invalid role'),
  
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'role', '-role'])
    .withMessage('Invalid sort parameter')
];

// All routes are protected
router.use(auth);

// Admin-only routes
router.get('/',
  queryValidation,
  getUsers
);

router.put('/:id/reactivate',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  reactivateUser
);

// User management routes
router.get('/:id',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  getUser
);

router.put('/:id',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  uploadMiddleware.single('avatar'),
  updateUserValidation,
  updateUser
);

router.delete('/:id',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  deleteUser
);

// User stats route
router.get('/:id/stats',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  getUserStats
);

// Deactivation route (user can deactivate own account, admin can deactivate any)
router.put('/:id/deactivate',
  param('id').isMongoId().withMessage('Valid user ID is required'),
  deactivateUser
);

module.exports = router;