import express from 'express'
import {
  generateCertificate,
  getUserCertificates,
  getCertificate,
  verifyCertificate,
  revokeCertificate,
  downloadCertificate
} from '../controllers/certificateController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/verify/:verificationCode', verifyCertificate)

// Protected routes
router.use(protect)

// User routes
router.get('/user/:userId', getUserCertificates)
router.get('/:certificateId', getCertificate)
router.get('/:certificateId/download', downloadCertificate)

// Certificate generation (protected, usually triggered by course completion)
router.post('/generate', generateCertificate)

// Admin routes
router.put('/:certificateId/revoke', authorize('admin'), revokeCertificate)

export default router