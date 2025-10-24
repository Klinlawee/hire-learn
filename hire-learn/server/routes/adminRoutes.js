import express from 'express'
import {
  // Dashboard
  getDashboardStats,
  
  // User Management
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  suspendUser,
  
  // Job Management
  getJobs,
  updateJob,
  deleteJob,
  featureJob,
  
  // Course Management
  getCourses,
  updateCourse,
  deleteCourse,
  featureCourse,
  
  // Certificate Management
  getCertificates,
  revokeCertificate,
  
  // Approval System
  getPendingApprovals,
  approveContent,
  rejectContent,
  
  // System Management
  getSystemStats,
  clearCache,
  backupDatabase
} from '../controllers/adminController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes protected and admin only
router.use(protect)
router.use(authorize('admin'))

// Dashboard
router.get('/dashboard', getDashboardStats)
router.get('/system/stats', getSystemStats)

// User Management
router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)
router.put('/users/:id/suspend', suspendUser)

// Job Management
router.get('/jobs', getJobs)
router.put('/jobs/:id', updateJob)
router.delete('/jobs/:id', deleteJob)
router.put('/jobs/:id/feature', featureJob)

// Course Management
router.get('/courses', getCourses)
router.put('/courses/:id', updateCourse)
router.delete('/courses/:id', deleteCourse)
router.put('/courses/:id/feature', featureCourse)

// Certificate Management
router.get('/certificates', getCertificates)
router.put('/certificates/:id/revoke', revokeCertificate)

// Approval System
router.get('/pending-approvals', getPendingApprovals)
router.put('/approve/:type/:id', approveContent)
router.put('/reject/:type/:id', rejectContent)

// System Operations
router.post('/clear-cache', clearCache)
router.post('/backup', backupDatabase)

export default router