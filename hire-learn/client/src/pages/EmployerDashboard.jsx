import React, { useState } from 'react'
import { Building, Briefcase, Users, TrendingUp, Plus, Eye, Edit, Trash2, MessageSquare } from 'lucide-react'

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Active Jobs', value: 8, icon: Briefcase, color: 'blue' },
    { label: 'Total Applications', value: 156, icon: Users, color: 'green' },
    { label: 'Interviews', value: 12, icon: MessageSquare, color: 'purple' },
    { label: 'Hire Rate', value: '15%', icon: TrendingUp, color: 'orange' }
  ]

  const jobPosts = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      applications: 24,
      views: 156,
      status: 'active',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      applications: 18,
      views: 98,
      status: 'active',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      applications: 32,
      views: 210,
      status: 'paused',
      posted: '3 weeks ago'
    }
  ]

  const recentApplications = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      status: 'New',
      date: '2024-01-15',
      match: 92
    },
    {
      id: 2,
      name: 'Mike Chen',
      position: 'Product Designer',
      status: 'Reviewed',
      date: '2024-01-14',
      match: 88
    },
    {
      id: 3,
      name: 'Emily Davis',
      position: 'DevOps Engineer',
      status: 'Interview',
      date: '2024-01-13',
      match: 95
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your jobs and candidates</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus size={20} className="mr-2" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
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
              {['overview', 'jobs', 'applications', 'candidates', 'company'].map((tab) => (
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
            {/* Job Posts */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Job Posts</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {jobPosts.map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.department}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>{job.applications} applications</span>
                        <span>{job.views} views</span>
                      </div>
                      <span className="text-sm text-gray-500">{job.posted}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-600 text-sm">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-red-600 text-sm">
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
              <div className="space-y-4">
                {recentApplications.map(application => (
                  <div key={application.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{application.name}</h3>
                        <p className="text-sm text-gray-600">{application.position}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {application.match}% Match
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        application.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {application.status}
                      </span>
                      <span className="text-xs text-gray-500">{application.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">2.3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Candidates</span>
                  <span className="font-semibold">42</span>
                </div>
              </div>
            </div>

            {/* Company Profile */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Building className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Company Profile</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Company Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold ml-1">4.8</span>
                  </div>
                </div>
                <button className="w-full btn-primary text-sm py-2">
                  Edit Company Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard