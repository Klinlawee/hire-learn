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
  getSavedJobs
} from '../controllers/jobController.js'
import { protect, authorize } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'admin'), createJob)

router.get('/search', searchJobs)
router.get('/employer/my-jobs', protect, authorize('employer', 'admin'), getEmployerJobs)

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob)

router.post('/:id/apply', protect, authorize('employee'), upload.single('resume'), applyForJob)
router.get('/:id/applicants', protect, authorize('employer', 'admin'), getApplicants)
router.put('/applications/:applicationId/status', protect, authorize('employer', 'admin'), updateApplicationStatus)

// Save jobs for employees
router.post('/:id/save', protect, authorize('employee'), saveJob)
router.get('/saved/mine', protect, authorize('employee'), getSavedJobs)

export default router