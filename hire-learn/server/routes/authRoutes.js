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
  resetPassword,
  changePassword,
  deleteAccount
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/google', googleAuth)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

// Protected routes
router.use(protect)

router.route('/profile')
  .get(getProfile)
  .put(updateProfile)

router.put('/change-password', changePassword)
router.delete('/account', deleteAccount)
router.post('/upload-resume', upload.single('resume'), uploadResume)

export default router