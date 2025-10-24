import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Bell, 
  Search, 
  Filter, 
  MapPin,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Bookmark,
  Share2
} from 'lucide-react'
import JobCard from '../components/JobCard'
import CourseCard from '../components/CourseCard'
import { toast } from 'react-hot-toast'

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from API
  const mockStats = {
    applicationsSent: 12,
    coursesEnrolled: 3,
    certificatesEarned: 2,
    unreadMessages: 5
  }

  const recentApplications = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      logo: '/api/placeholder/40/40',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $100,000',
      experience: 'Mid Level',
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      posted: '2024-01-15',
      urgent: false,
      featured: true,
      remote: true,
      matchScore: 95,
      isApplied: true,
      applicationStatus: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      logo: '/api/placeholder/40/40',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$70,000 - $90,000',
      experience: 'Mid Level',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      posted: '2024-01-12',
      urgent: true,
      featured: false,
      remote: false,
      matchScore: 88,
      isApplied: true,
      applicationStatus: 'Interview',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupXYZ',
      logo: '/api/placeholder/40/40',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      experience: 'Senior Level',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
      posted: '2024-01-10',
      urgent: false,
      featured: false,
      remote: true,
      matchScore: 92,
      isApplied: true,
      applicationStatus: 'Rejected',
      statusColor: 'bg-red-100 text-red-800'
    }
  ]

  const recommendedJobs = [
    {
      id: 4,
      title: 'React Developer',
      company: 'WebSolutions Inc',
      logo: '/api/placeholder/40/40',
      location: 'Remote',
      type: 'Full-time',
      salary: '$85,000 - $105,000',
      experience: 'Mid Level',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      posted: '2024-01-14',
      urgent: false,
      featured: true,
      remote: true,
      matchScore: 95,
      isApplied: false,
      applicationStatus: null
    },
    {
      id: 5,
      title: 'Full Stack Engineer',
      company: 'TechInnovate',
      logo: '/api/placeholder/40/40',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      experience: 'Senior Level',
      skills: ['JavaScript', 'Python', 'React', 'Django', 'PostgreSQL'],
      posted: '2024-01-13',
      urgent: true,
      featured: false,
      remote: false,
      matchScore: 88,
      isApplied: false,
      applicationStatus: null
    },
    {
      id: 6,
      title: 'JavaScript Developer',
      company: 'DigitalAgency',
      logo: '/api/placeholder/40/40',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$70 - $90/hr',
      experience: 'Mid Level',
      skills: ['JavaScript', 'Vue.js', 'CSS', 'REST APIs'],
      posted: '2024-01-12',
      urgent: false,
      featured: true,
      remote: true,
      matchScore: 92,
      isApplied: false,
      applicationStatus: null
    }
  ]

  const enrolledCourses = [
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Jane Smith',
      description: 'Build scalable backend applications with Node.js and Express framework.',
      duration: '15 hours',
      level: 'Advanced',
      students: 1800,
      rating: 4.7,
      price: 99.99,
      originalPrice: 149.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Backend Development',
      featured: false,
      isEnrolled: true,
      isCompleted: false,
      progress: 35
    },
    {
      id: 5,
      title: 'Mobile App Development with Flutter',
      instructor: 'Alex Chen',
      description: 'Build cross-platform mobile apps using Flutter and Dart programming language.',
      duration: '18 hours',
      level: 'Intermediate',
      students: 1900,
      rating: 4.7,
      price: 94.99,
      originalPrice: 139.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Mobile Development',
      featured: false,
      isEnrolled: true,
      isCompleted: true,
      progress: 100
    }
  ]

  const upcomingInterviews = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Frontend Developer',
      date: '2024-01-20',
      time: '2:00 PM',
      type: 'Technical Interview',
      interviewer: 'Sarah Johnson',
      status: 'Scheduled'
    },
    {
      id: 2,
      company: 'DesignStudio',
      position: 'UI/UX Designer',
      date: '2024-01-22',
      time: '10:00 AM',
      type: 'Portfolio Review',
      interviewer: 'Mike Chen',
      status: 'Scheduled'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500))
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

  const handleSaveJob = (jobId, saved) => {
    toast.success(saved ? 'Job saved!' : 'Job removed from saved')
    // TODO: Implement API call to save/unsave job
  }

  const handleShareJob = (jobId) => {
    toast.success('Job link copied to clipboard!')
    // TODO: Implement share functionality
  }

  const handleQuickApply = (jobId) => {
    toast.success('Application submitted successfully!')
    // TODO: Implement quick apply functionality
  }

  const statsData = [
    { label: 'Applications Sent', value: stats.applicationsSent, icon: Briefcase, color: 'blue' },
    { label: 'Courses Enrolled', value: stats.coursesEnrolled, icon: BookOpen, color: 'green' },
    { label: 'Certificates Earned', value: stats.certificatesEarned, icon: FileText, color: 'purple' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'orange' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, John! 👋</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            }
            return (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'jobs', 'applications', 'courses', 'messages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
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
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Search */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Find Your Next Job</h2>
                <Filter size={20} className="text-gray-400" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="input-field pl-10"
                  />
                </div>
                <button className="btn-primary px-6 whitespace-nowrap">
                  Search
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Recommended based on your profile</span>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                  Advanced Search
                </Link>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recommended Jobs</h2>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recommendedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    variant="list"
                    showMatchScore={true}
                    onSave={handleSaveJob}
                    onShare={handleShareJob}
                    onQuickApply={handleQuickApply}
                  />
                ))}
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Continue Learning</h2>
                <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
                  Browse Courses
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {enrolledCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    variant="grid"
                    showProgress={true}
                    showStats={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Link to="/employee/dashboard?tab=applications" className="text-primary-600 hover:text-primary-700 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentApplications.map(application => (
                  <div key={application.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{application.title}</h3>
                        <p className="text-sm text-gray-600">{application.company}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${application.statusColor}`}>
                        {application.applicationStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Applied on {new Date(application.posted).toLocaleDateString()}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {application.matchScore}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
              <div className="space-y-4">
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className="border border-primary-200 bg-primary-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{interview.position}</h3>
                        <p className="text-sm text-gray-600">{interview.company}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {interview.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(interview.date).toLocaleDateString()} at {interview.time}
                      </div>
                      <div>{interview.type} with {interview.interviewer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/employee/profile"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Update Profile</div>
                    <div className="text-sm text-gray-600">Complete your profile to get better matches</div>
                  </div>
                </Link>
                
                <Link
                  to="/employee/resume"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Upload Resume</div>
                    <div className="text-sm text-gray-600">Make your resume visible to employers</div>
                  </div>
                </Link>
                
                <Link
                  to="/courses"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Browse Courses</div>
                    <div className="text-sm text-gray-600">Upskill with our learning courses</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Strength</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-sm text-gray-600">
                  Complete your profile to increase your visibility to employers
                </div>
                <button className="w-full btn-primary text-sm py-2">
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard