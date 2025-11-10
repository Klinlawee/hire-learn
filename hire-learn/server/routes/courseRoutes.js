const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

// Import controllers
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
  addReview,
  getInstructorCourses
} = require('../controllers/courseController');

// Import middleware
const auth = require('../middleware/auth');
const { uploadMiddleware } = require('../config/cloudinary');

// Validation rules
const courseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 100 })
    .withMessage('Course title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .isIn(['web-development', 'mobile-development', 'data-science', 'design', 'marketing', 'business', 'photography', 'music', 'health', 'language', 'other'])
    .withMessage('Valid category is required'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .withMessage('Valid level is required'),
  
  body('duration.value')
    .isInt({ min: 1 })
    .withMessage('Duration value must be a positive number'),
  
  body('duration.unit')
    .isIn(['hours', 'days', 'weeks', 'months'])
    .withMessage('Valid duration unit is required'),
  
  body('price.amount')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('price.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters'),
  
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('learningOutcomes')
    .optional()
    .isArray()
    .withMessage('Learning outcomes must be an array'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review comment cannot exceed 500 characters')
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
  
  query('category')
    .optional()
    .isIn(['web-development', 'mobile-development', 'data-science', 'design', 'marketing', 'business', 'photography', 'music', 'health', 'language', 'other'])
    .withMessage('Invalid category'),
  
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .withMessage('Invalid level'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'price', '-price', 'rating', '-rating', 'title', '-title'])
    .withMessage('Invalid sort parameter')
];

// Public routes
router.get('/', queryValidation, getCourses);
router.get('/:id',
  param('id').isMongoId().withMessage('Valid course ID is required'),
  getCourse
);

// Protected routes
router.post('/', 
  auth, 
  uploadMiddleware.single('thumbnail'),
  courseValidation, 
  createCourse
);
router.put('/:id',
  auth,
  param('id').isMongoId().withMessage('Valid course ID is required'),
  uploadMiddleware.single('thumbnail'),
  courseValidation,
  updateCourse
);
router.delete('/:id',
  auth,
  param('id').isMongoId().withMessage('Valid course ID is required'),
  deleteCourse
);

// Enrollment routes
router.post('/:id/enroll',
  auth,
  param('id').isMongoId().withMessage('Valid course ID is required'),
  enrollInCourse
);

// Review routes
router.post('/:id/reviews',
  auth,
  param('id').isMongoId().withMessage('Valid course ID is required'),
  reviewValidation,
  addReview
);

// User-specific routes
router.get('/my-courses/enrolled',
  auth,
  queryValidation,
  getEnrolledCourses
);

router.get('/instructor/my-courses',
  auth,
  queryValidation,
  getInstructorCourses
);

module.exports = router;