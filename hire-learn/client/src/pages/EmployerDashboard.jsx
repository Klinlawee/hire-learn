import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'
import JobCard from '../components/JobCard'
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  Plus,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react'

const EmployerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch employer's jobs
      const jobsResponse = await axios.get('/api/jobs/employer/my-jobs')
      setJobs(jobsResponse.data.data || [])

      // Fetch applications for employer's jobs
      const applicationsResponse = await axios.get('/api/jobs/applications/employer')
      setApplications(applicationsResponse.data.data || [])

      // Calculate stats
      const jobStats = {
        totalJobs: jobsResponse.data.data?.length || 0,
        activeJobs: jobsResponse.data.data?.filter(job => job.status === 'active').length || 0,
        totalApplications: applicationsResponse.data.data?.length || 0,
        newApplications: applicationsResponse.data.data?.filter(app => 
          app.status === 'applied'
        ).length || 0
      }

      setStats(jobStats)

      // Generate recent activity
      const activity = [
        ...applicationsResponse.data.data?.slice(0, 3).map(app => ({
          type: 'application',
          message: `New application for ${app.job?.title}`,
          time: new Date(app.createdAt).toLocaleDateString(),
          icon: Users
        })) || [],
        ...jobsResponse.data.data?.slice(0, 2).map(job => ({
          type: 'job',
          message: `Job "${job.title}" published`,
          time: new Date(job.createdAt).toLocaleDateString(),
          icon: Briefcase
        })) || []
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

      setRecentActivity(activity)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getApplicationStatusIcon = (status) => {
    if (['accepted', 'offered'].includes(status)) return CheckCircle
    if (['rejected', 'withdrawn'].includes(status)) return XCircle
    return FileText
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employer Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your job postings and applications.
            </p>
          </div>
          <Link to="/jobs/create" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.activeJobs}</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.newApplications}</div>
                <div className="text-sm text-gray-600">New Applications</div>
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
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {application.applicant?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Applied for {application.job?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                            {application.status.replace('-', ' ')}
                          </span>
                          <Link
                            to={`/jobs/${application.job?._id}/applications/${application._id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">Applications will appear here when candidates apply to your jobs.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Jobs */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Your Active Jobs</h2>
                <Link to="/jobs/employer/my-jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="p-6">
                {jobs.filter(job => job.status === 'active').length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {jobs.filter(job => job.status === 'active').slice(0, 4).map(job => (
                      <JobCard
                        key={job._id}
                        job={job}
                        showApplyButton={false}
                        showEmployer={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                    <p className="text-gray-600 mb-4">Create your first job posting to attract candidates.</p>
                    <Link to="/jobs/create" className="btn-primary">
                      Post a Job
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/jobs/create" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Plus className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Post New Job</span>
                </Link>
                <Link to="/jobs/employer/my-jobs" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Briefcase className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Manage Jobs</span>
                </Link>
                <Link to="/applications" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">View Applications</span>
                </Link>
                <Link to="/company/profile" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <FileText className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium">Company Profile</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Application Rate</span>
                    <span className="font-medium">
                      {stats.totalJobs > 0 ? Math.round((stats.totalApplications / stats.totalJobs) * 10) / 10 : 0} per job
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalJobs > 0 ? Math.min((stats.totalApplications / stats.totalJobs) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Active Jobs</span>
                    <span className="font-medium">
                      {stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats.totalJobs > 0 ? (stats.activeJobs / stats.totalJobs) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard