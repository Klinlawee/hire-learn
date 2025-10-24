import express from 'express'
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getCourseProgress,
  updateLessonProgress,
  completeQuiz,
  rateCourse,
  getInstructorCourses
} from '../controllers/courseController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.route('/')
  .get(getCourses)
  .post(protect, authorize('employer', 'admin'), createCourse)

router.get('/instructor/my-courses', protect, authorize('employer', 'admin'), getInstructorCourses)
router.get('/enrolled/mine', protect, getEnrolledCourses)

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('employer', 'admin'), updateCourse)
  .delete(protect, authorize('employer', 'admin'), deleteCourse)

router.post('/:id/enroll', protect, enrollCourse)
router.get('/:id/progress', protect, getCourseProgress)
router.put('/:id/progress/lesson', protect, updateLessonProgress)
router.post('/:id/quiz/:quizId/complete', protect, completeQuiz)
router.post('/:id/rate', protect, rateCourse)

export default router