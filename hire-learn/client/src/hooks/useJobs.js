import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedJobs, setSelectedJobs] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])

  // Mock data - in real app, this would come from API
  const mockStats = {
    totalUsers: 12547,
    totalJobs: 2843,
    totalCourses: 567,
    pendingApprovals: 23,
    totalRevenue: 125430,
    activeEmployers: 892,
    activeJobSeekers: 9843,
    systemHealth: 99.8
  }

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'employee',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-18',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'employer',
      status: 'active',
      joinDate: '2024-01-14',
      lastLogin: '2024-01-18',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'employee',
      status: 'suspended',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-12',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'employer',
      status: 'pending',
      joinDate: '2024-01-18',
      lastLogin: '2024-01-18',
      avatar: '/api/placeholder/40/40'
    }
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: 'job',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc',
      submittedBy: 'Jane Smith',
      submittedDate: '2024-01-18',
      status: 'pending'
    },
    {
      id: 2,
      type: 'course',
      title: 'Advanced React Patterns',
      instructor: 'John Developer',
      submittedBy: 'Mike Instructor',
      submittedDate: '2024-01-17',
      status: 'pending'
    },
    {
      id: 3,
      type: 'employer',
      company: 'StartupXYZ',
      submittedBy: 'Alice Founder',
      submittedDate: '2024-01-16',
      status: 'pending'
    }
  ]

  const recentJobs = [
    {
      id: 1,
      title: 'Full Stack Developer',
      company: 'TechSolutions',
      category: 'Engineering',
      applications: 24,
      status: 'active',
      posted: '2024-01-18',
      featured: true
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'DesignStudio',
      category: 'Design',
      applications: 18,
      status: 'active',
      posted: '2024-01-17',
      featured: false
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataInsights',
      category: 'Data Science',
      applications: 32,
      status: 'paused',
      posted: '2024-01-16',
      featured: true
    }
  ]

  const recentCourses = [
    {
      id: 1,
      title: 'React Masterclass 2024',
      instructor: 'John Doe',
      category: 'Web Development',
      students: 2500,
      rating: 4.8,
      status: 'published',
      revenue: 12500
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Jane Smith',
      category: 'Backend Development',
      students: 1800,
      rating: 4.7,
      status: 'published',
      revenue: 9800
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      category: 'Design',
      students: 3200,
      rating: 4.9,
      status: 'draft',
      revenue: 0
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High server load detected',
      timestamp: '2024-01-18 14:30',
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      message: 'Scheduled maintenance tonight',
      timestamp: '2024-01-18 10:15',
      resolved: false
    },
    {
      id: 3,
      type: 'success',
      message: 'Backup completed successfully',
      timestamp: '2024-01-18 06:00',
      resolved: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setStats(mockStats)
      } catch (error) {
        toast.error('Failed to load dashboard data')
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleApprove = (id, type) => {
    toast.success(`${type} approved successfully!`)
    // TODO: Implement API call
  }

  const handleReject = (id, type) => {
    toast.error(`${type} rejected!`)
    // TODO: Implement API call
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      toast.success('User deleted successfully!')
      // TODO: Implement API call
    }
  }

  const handleSuspendUser = (userId) => {
    toast.success('User suspended successfully!')
    // TODO: Implement API call
  }

  const handleBulkAction = (action, items, type) => {
    toast.success(`${action} performed on ${items.length} ${type}`)
    // TODO: Implement bulk actions
  }

  const statsData = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      change: '+8%',
      trend: 'up',
      icon: Briefcase,
      color: 'green'
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      change: '+15%',
      trend: 'up',
      icon: BookOpen,
      color: 'purple'
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: '-5%',
      trend: 'down',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue?.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      label: 'System Health',
      value: `${stats.systemHealth}%`,
      change: '+0.2%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and management</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center">
              <Download size={20} className="mr-2" />
              Export Report
            </button>
            <button className="btn-primary flex items-center">
              <Settings size={20} className="mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
              emerald: 'bg-emerald-100 text-emerald-600'
            }
            return (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                'overview', 
                'users', 
                'jobs', 
                'courses', 
                'approvals', 
                'reports',
                'system'
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Approvals */}
            {activeTab === 'overview' && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Pending Approvals</h2>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingApprovals.length} pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingApprovals.map(approval => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          approval.type === 'job' ? 'bg-blue-100 text-blue-600' :
                          approval.type === 'course' ? 'bg-purple-100 text-purple-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {approval.type === 'job' && <Briefcase size={20} />}
                          {approval.type === 'course' && <BookOpen size={20} />}
                          {approval.type === 'employer' && <Users size={20} />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{approval.title || approval.company}</h3>
                          <p className="text-sm text-gray-600">
                            Submitted by {approval.submittedBy} • {new Date(approval.submittedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(approval.id, approval.type)}
                          className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(approval.id, approval.type)}
                          className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          <XCircle size={16} className="mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="input-field pl-10 text-sm"
                      />
                    </div>
                    <select className="input-field text-sm">
                      <option>All Roles</option>
                      <option>Employee</option>
                      <option>Employer</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(recentUsers.map(user => user.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                          />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Login</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(prev => [...prev, user.id])
                                } else {
                                  setSelectedUsers(prev => prev.filter(id => id !== user.id))
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-sm text-gray-600">{user.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-yellow-600 hover:text-yellow-700"
                                title="Suspend user"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {selectedUsers.length} users selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('suspend', selectedUsers, 'users')}
                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete', selectedUsers, 'users')}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jobs Management */}
            {activeTab === 'jobs' && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Job Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        className="input-field pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentJobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.category}</span>
                            <span>•</span>
                            <span>{job.applications} applications</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        {job.featured && (
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Management */}
            {activeTab === 'courses' && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Course Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        className="input-field pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>By {course.instructor}</span>
                            <span>•</span>
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.students} students</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${course.revenue}</div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* System Alerts */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">System Alerts</h2>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {systemAlerts.filter(alert => !alert.resolved).length} active
                </span>
              </div>
              <div className="space-y-3">
                {systemAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 border rounded-lg ${getAlertColor(alert.type)} ${
                      alert.resolved ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                      </div>
                      {alert.resolved && (
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Employers</span>
                  <span className="font-semibold">{stats.activeEmployers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Job Seekers</span>
                  <span className="font-semibold">{stats.activeJobSeekers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Growth</span>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">1.2s</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New job posted</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Course enrollment</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">System Health</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">CPU Usage</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Disk Usage</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }}></div>
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

export default AdminDashboard