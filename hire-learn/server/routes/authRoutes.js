import express from 'express'
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadResume,
  googleAuth,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/google', googleAuth)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile)

router.post('/upload-resume', protect, upload.single('resume'), uploadResume)

export default router