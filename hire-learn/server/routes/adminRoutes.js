import express from 'express'
import {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getJobs,
  updateJob,
  deleteJob,
  getCourses,
  updateCourse,
  deleteCourse,
  getCertificates,
  approveContent,
  getPendingApprovals
} from '../controllers/adminController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes protected and admin only
router.use(protect)
router.use(authorize('admin'))

router.get('/dashboard', getDashboardStats)
router.get('/users', getUsers)
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser)

router.get('/jobs', getJobs)
router.route('/jobs/:id')
  .put(updateJob)
  .delete(deleteJob)

router.get('/courses', getCourses)
router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse)

router.get('/certificates', getCertificates)
router.get('/pending-approvals', getPendingApprovals)
router.put('/approve/:type/:id', approveContent)

export default router