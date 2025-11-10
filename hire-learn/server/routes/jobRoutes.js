const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

// Import controllers
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getEmployerJobs
} = require('../controllers/jobController');

// Import middleware
const auth = require('../middleware/auth');
const { uploadMiddleware } = require('../config/cloudinary');

// Validation rules
const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('company')
    .isMongoId()
    .withMessage('Valid company ID is required'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('category')
    .isIn(['technology', 'design', 'marketing', 'sales', 'finance', 'hr', 'operations', 'healthcare', 'education', 'other'])
    .withMessage('Valid category is required'),
  
  body('type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Valid job type is required'),
  
  body('remote')
    .optional()
    .isIn(['remote', 'on-site', 'hybrid'])
    .withMessage('Valid remote option is required'),
  
  body('level')
    .optional()
    .isIn(['intern', 'entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Valid experience level is required'),
  
  body('salary.min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  
  body('salary.max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Valid application deadline date is required')
];

const applyToJobValidation = [
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
  
  body('screeningQuestions')
    .optional()
    .isArray()
    .withMessage('Screening questions must be an array')
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
    .isIn(['technology', 'design', 'marketing', 'sales', 'finance', 'hr', 'operations', 'healthcare', 'education', 'other'])
    .withMessage('Invalid category'),
  
  query('type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  query('remote')
    .optional()
    .isIn(['remote', 'on-site', 'hybrid'])
    .withMessage('Invalid remote option'),
  
  query('level')
    .optional()
    .isIn(['intern', 'entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  
  query('minSalary')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  
  query('maxSalary')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'salary', '-salary', 'title', '-title'])
    .withMessage('Invalid sort parameter')
];

// Public routes
router.get('/', queryValidation, getJobs);
router.get('/:id', 
  param('id').isMongoId().withMessage('Valid job ID is required'),
  getJob
);

// Protected routes
router.post('/', auth, jobValidation, createJob);
router.put('/:id', 
  auth,
  param('id').isMongoId().withMessage('Valid job ID is required'),
  jobValidation,
  updateJob
);
router.delete('/:id', 
  auth,
  param('id').isMongoId().withMessage('Valid job ID is required'),
  deleteJob
);

// Job application routes
router.post('/:id/apply',
  auth,
  param('id').isMongoId().withMessage('Valid job ID is required'),
  uploadMiddleware.single('resume'),
  applyToJobValidation,
  applyToJob
);

// Employer-specific routes
router.get('/employer/my-jobs',
  auth,
  queryValidation,
  getEmployerJobs
);

module.exports = router;