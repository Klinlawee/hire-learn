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
  getInstructorCourses,
  searchCourses,
  featuredCourses,
  getCourseAnalytics,
  // Quiz-specific methods
  getQuiz,
  submitQuiz,
  getQuizResults
} from '../controllers/courseController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getCourses)
router.get('/search', searchCourses)
router.get('/featured', featuredCourses)
router.get('/:id', getCourse)

// Protected routes
router.use(protect)

// Student routes
router.get('/enrolled/mine', getEnrolledCourses)
router.post('/:id/enroll', enrollCourse)
router.get('/:id/progress', getCourseProgress)
router.put('/:id/progress/lesson', updateLessonProgress)
router.post('/:id/rate', rateCourse)

// Quiz routes
router.get('/:courseId/quiz/:quizId', getQuiz)
router.post('/:courseId/quiz/:quizId/submit', submitQuiz)
router.get('/:courseId/quiz/:quizId/results', getQuizResults)

// Instructor routes
router.post('/', authorize('employer', 'admin'), createCourse)
router.get('/instructor/my-courses', authorize('employer', 'admin'), getInstructorCourses)
router.get('/instructor/analytics/:id', authorize('employer', 'admin'), getCourseAnalytics)

// Course management (instructor and admin)
router.route('/:id')
  .put(authorize('employer', 'admin'), updateCourse)
  .delete(authorize('employer', 'admin'), deleteCourse)

export default router