import express from 'express'
import {
  generateCertificate,
  getUserCertificates,
  getCertificate,
  verifyCertificate,
  revokeCertificate
} from '../controllers/certificateController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.route('/')
  .post(protect, generateCertificate)

router.get('/user/:userId', protect, getUserCertificates)
router.get('/:certificateId', getCertificate)
router.get('/verify/:verificationCode', verifyCertificate)
router.put('/:certificateId/revoke', protect, authorize('admin'), revokeCertificate)

export default router