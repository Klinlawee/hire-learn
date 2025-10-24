import express from 'express'
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  getEmployerJobs,
  getApplicants,
  updateApplicationStatus,
  searchJobs,
  saveJob,
  getSavedJobs,
  getJobStats,
  featuredJobs
} from '../controllers/jobController.js'
import { protect, authorize } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getJobs)
router.get('/search', searchJobs)
router.get('/featured', featuredJobs)
router.get('/:id', getJob)

// Protected routes
router.use(protect)

// Job seeker routes
router.get('/saved/mine', authorize('employee'), getSavedJobs)
router.post('/:id/save', authorize('employee'), saveJob)
router.post('/:id/apply', authorize('employee'), upload.single('resume'), applyForJob)

// Employer routes
router.post('/', authorize('employer', 'admin'), createJob)
router.get('/employer/my-jobs', authorize('employer', 'admin'), getEmployerJobs)
router.get('/employer/stats', authorize('employer', 'admin'), getJobStats)
router.get('/:id/applicants', authorize('employer', 'admin'), getApplicants)
router.put('/applications/:applicationId/status', authorize('employer', 'admin'), updateApplicationStatus)

// Job management (employer and admin)
router.route('/:id')
  .put(authorize('employer', 'admin'), updateJob)
  .delete(authorize('employer', 'admin'), deleteJob)

export default router