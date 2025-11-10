import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal, { ConfirmationModal } from '../components/Modal'
import {
  Star,
  Clock,
  Users,
  PlayCircle,
  BookOpen,
  Award,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText
} from 'lucide-react'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCourseDetail()
  }, [id])

  const fetchCourseDetail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/courses/${id}`)
      setCourse(response.data.data)
    } catch (error) {
      console.error('Error fetching course:', error)
      setError('Course not found or you may not have permission to view it.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }

    setIsEnrolling(true)
    try {
      const response = await axios.post(`/api/courses/${id}/enroll`)
      
      setEnrollmentSuccess(true)
      setShowEnrollModal(false)
      
      // Refresh course data to update enrollment count
      fetchCourseDetail()
    } catch (error) {
      console.error('Error enrolling in course:', error)
      alert('Failed to enroll. Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const shareCourse = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out this course: ${course.title} by ${course.instructor?.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Course link copied to clipboard!')
    }
  }

  const formatDuration = () => {
    if (!course.duration) return 'Self-paced'
    return `${course.duration.value} ${course.duration.unit}`
  }

  const formatPrice = () => {
    if (course.price?.isFree) return 'Free'
    
    const currentPrice = course.currentPrice || course.price?.amount
    if (!currentPrice) return 'Free'
    
    return `$${currentPrice}`
  }

  const getDiscount = () => {
    if (course.price?.isFree || !course.price?.discount?.percentage) return null
    
    const hasValidDiscount = course.price.discount.percentage > 0 && 
      (!course.price.discount.validUntil || new Date(course.price.discount.validUntil) > new Date())
    
    return hasValidDiscount ? course.price.discount.percentage : null
  }

  const discount = getDiscount()

  if (isLoading) {
    return <LoadingSpinner text="Loading course details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-error-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/courses" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-start mb-6">
                {/* Course Thumbnail */}
                {course.thumbnail?.url ? (
                  <img
                    src={course.thumbnail.url}
                    alt={course.title}
                    className="w-32 h-32 rounded-lg object-cover border border-gray-200 mr-6"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center border border-gray-200 mr-6">
                    <BookOpen className="w-12 h-12 text-purple-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="badge-secondary capitalize mr-3">
                      {course.category?.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {course.level}
                    </span>
                    {course.featured && (
                      <span className="badge-primary ml-3">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>

                  <p className="text-lg text-gray-600 mb-6">
                    {course.shortDescription || course.description?.substring(0, 200)}...
                  </p>

                  {/* Instructor Info */}
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {course.instructor?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Course Instructor
                      </div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.rating?.average?.toFixed(1) || 'New'}
                        </div>
                        <div className="text-sm">
                          ({course.rating?.count || 0} reviews)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.enrollmentCount || 0}
                        </div>
                        <div className="text-sm">Students</div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDuration()}
                        </div>
                        <div className="text-sm">Duration</div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Award className="w-5 h-5 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.certificate?.included ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm">Certificate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:w-80 lg:ml-8 mt-6 lg:mt-0">
              <div className="card p-6 sticky top-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice()}
                  </div>
                  
                  {discount && course.price?.amount && (
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-lg text-gray-500 line-through">
                        ${course.price.amount}
                      </span>
                      <span className="badge-error">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                  
                  {course.price?.isFree && (
                    <div className="text-sm text-success-600 font-medium">
                      Free forever
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="btn-primary w-full"
                  >
                    {course.price?.isFree ? 'Enroll for Free' : 'Enroll Now'}
                  </button>
                  
                  <button
                    onClick={shareCourse}
                    className="btn-outline w-full flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  
                  <button className="btn-outline w-full flex items-center justify-center">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save for Later
                  </button>
                </div>

                {/* Course Includes */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <PlayCircle className="w-4 h-4 mr-2 text-primary-600" />
                      {course.totalDuration || 'Several'} hours of video
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-primary-600" />
                      Downloadable resources
                    </li>
                    <li className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-primary-600" />
                      Assignments & exercises
                    </li>
                    {course.certificate?.included && (
                      <li className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-primary-600" />
                        Certificate of completion
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'curriculum', 'reviews', 'instructor'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
                  </div>
                </div>

                {/* Learning Outcomes */}
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'curriculum' && course.curriculum && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">{section.section}</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <PlayCircle className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {lecture.duration} minutes
                                  {lecture.isPreview && (
                                    <span className="ml-2 text-primary-600 font-medium">Preview</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lecture.isPreview && (
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                  Preview
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Student Reviews</h2>
                {course.reviews && course.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {course.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <Users className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this course.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'instructor' && course.instructor && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">About the Instructor</h2>
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {course.instructor.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {course.instructor.profile?.bio || 'Experienced instructor with a passion for teaching.'}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                        <p className="text-gray-600">
                          {course.instructor.experience?.[0]?.position} at {course.instructor.experience?.[0]?.company}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                        <p className="text-gray-600">
                          {course.instructor.education?.[0]?.degree} from {course.instructor.education?.[0]?.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Features */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Course Features</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skill Level</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{course.language || 'English'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lifetime Access</span>
                  <span className="font-medium text-success-600">Yes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Certificate</span>
                  <span className={`font-medium ${
                    course.certificate?.included ? 'text-success-600' : 'text-gray-600'
                  }`}>
                    {course.certificate?.included ? 'Included' : 'Not Included'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Course Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      <ConfirmationModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onConfirm={handleEnroll}
        title={`Enroll in ${course.title}`}
        message={`You're about to enroll in this course. ${course.price?.isFree ? 'This course is free!' : `This will cost $${formatPrice()}.`}`}
        confirmText={isEnrolling ? "Enrolling..." : "Confirm Enrollment"}
        cancelText="Cancel"
        isLoading={isEnrolling}
      />

      {/* Enrollment Success Modal */}
      <Modal
        isOpen={enrollmentSuccess}
        onClose={() => setEnrollmentSuccess(false)}
        title="Enrollment Successful!"
        size="sm"
      >
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            You have been successfully enrolled in the course. You can now access all course materials and start learning.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setEnrollmentSuccess(false)}
              className="btn-outline flex-1"
            >
              Continue Browsing
            </button>
            <Link
              to={`/courses/learn/${course._id}`}
              className="btn-primary flex-1 text-center"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CourseDetail