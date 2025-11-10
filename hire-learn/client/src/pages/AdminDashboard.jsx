import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'
import {
  Users,
  Briefcase,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Eye
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [recentUsers, setRecentUsers] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [recentCourses, setRecentCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch users
      const usersResponse = await axios.get('/api/users', { params: { limit: 5 } })
      setRecentUsers(usersResponse.data.data || [])

      // Fetch jobs
      const jobsResponse = await axios.get('/api/jobs', { params: { limit: 5 } })
      setRecentJobs(jobsResponse.data.data || [])

      // Fetch courses
      const coursesResponse = await axios.get('/api/courses', { params: { limit: 5 } })
      setRecentCourses(coursesResponse.data.data || [])

      // Calculate stats (in a real app, these would come from dedicated stats endpoints)
      const dashboardStats = {
        totalUsers: 1250,
        totalJobs: 89,
        totalCourses: 45,
        pendingApprovals: 12,
        activeEmployers: 34,
        totalRevenue: 12500
      }

      setStats(dashboardStats)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'bg-success-100 text-success-800', label: 'Active' },
      'inactive': { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      'pending': { color: 'bg-warning-100 text-warning-800', label: 'Pending' },
      'published': { color: 'bg-success-100 text-success-800', label: 'Published' },
      'draft': { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    }

    const config = statusConfig[status] || statusConfig.inactive
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
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
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage platform users, content, and analytics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                <div className="text-sm text-gray-600">Published Courses</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Users */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
                <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(user.isActive ? 'active' : 'inactive')}
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
                <Link to="/admin/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentJobs.map(job => (
                    <div key={job._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(job.status)}
                        <span className="text-xs text-gray-500">
                          {job.applicationCount || 0} apps
                        </span>
                        <Link
                          to={`/admin/jobs/${job._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/users" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Manage Users</span>
                </Link>
                <Link to="/admin/jobs" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Briefcase className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Manage Jobs</span>
                </Link>
                <Link to="/admin/courses" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Manage Courses</span>
                </Link>
                <Link to="/admin/settings" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Settings className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Platform Settings</span>
                </Link>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Pending Approvals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-warning-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-warning-800">Company Verifications</div>
                      <div className="text-xs text-warning-600">5 companies waiting</div>
                    </div>
                  </div>
                  <Link to="/admin/approvals" className="text-warning-700 hover:text-warning-800 text-sm font-medium">
                    Review
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">Course Reviews</div>
                      <div className="text-xs text-blue-600">3 courses pending</div>
                    </div>
                  </div>
                  <Link to="/admin/courses/pending" className="text-blue-700 hover:text-blue-800 text-sm font-medium">
                    Review
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-purple-800">User Reports</div>
                      <div className="text-xs text-purple-600">4 reports to review</div>
                    </div>
                  </div>
                  <Link to="/admin/reports" className="text-purple-700 hover:text-purple-800 text-sm font-medium">
                    Review
                  </Link>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center text-success-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center text-success-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <div className="flex items-center text-warning-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">75% Used</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-gray-900">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard