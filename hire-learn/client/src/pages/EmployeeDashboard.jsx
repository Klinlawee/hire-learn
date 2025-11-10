import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'
import JobCard from '../components/JobCard'
import {
  Briefcase,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  User,
  DollarSign,
  MapPin
} from 'lucide-react'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [applications, setApplications] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch applications
      const applicationsResponse = await axios.get('/api/jobs/applications/my-applications')
      setApplications(applicationsResponse.data.data || [])

      // Fetch recommended jobs
      const jobsResponse = await axios.get('/api/jobs', {
        params: { limit: 6, sort: '-createdAt' }
      })
      setRecommendedJobs(jobsResponse.data.data || [])

      // Fetch enrolled courses
      const coursesResponse = await axios.get('/api/courses/my-courses/enrolled')
      setEnrolledCourses(coursesResponse.data.data || [])

      // Calculate stats
      const applicationStats = {
        total: applicationsResponse.data.data?.length || 0,
        pending: applicationsResponse.data.data?.filter(app => 
          ['applied', 'under-review', 'shortlisted'].includes(app.status)
        ).length || 0,
        interviews: applicationsResponse.data.data?.filter(app => 
          app.status === 'interview'
        ).length || 0,
        accepted: applicationsResponse.data.data?.filter(app => 
          app.status === 'accepted'
        ).length || 0
      }

      setStats(applicationStats)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getApplicationStatusColor = (status) => {
    const statusColors = {
      'applied': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'shortlisted': 'bg-purple-100 text-purple-800',
      'interview': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800',
      'offered': 'bg-teal-100 text-teal-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status) => {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Here's your career dashboard and latest opportunities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.interviews}</div>
                <div className="text-sm text-gray-600">Interviews</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Accepted Offers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              </div>
              <div className="p-6">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map(application => (
                      <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {application.job?.company?.logo ? (
                            <img
                              src={application.job.company.logo.url}
                              alt={application.job.company.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {application.job?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.job?.company?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                          {formatStatus(application.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">Start applying to jobs to see them here.</p>
                    <Link to="/jobs" className="btn-primary">
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedJobs.slice(0, 4).map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      showApplyButton={true}
                      showEmployer={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Profile Completion</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Basic Info</span>
                  <span className="font-medium text-success-600">Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-success-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-medium text-warning-600">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-warning-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-warning-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-warning-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>

                <Link to="/profile" className="btn-outline w-full text-center">
                  Complete Profile
                </Link>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">My Courses</h3>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.slice(0, 3).map(certificate => (
                    <div key={certificate._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <BookOpen className="w-8 h-8 text-primary-600" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {certificate.course?.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Progress: {certificate.progress?.completed || 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link to="/courses/my-courses/enrolled" className="btn-outline w-full text-center text-sm">
                    View All Courses
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">No enrolled courses yet</p>
                  <Link to="/courses" className="btn-primary text-sm w-full">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/jobs" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Briefcase className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Browse Jobs</span>
                </Link>
                <Link to="/courses" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Find Courses</span>
                </Link>
                <Link to="/profile" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <User className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Update Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard