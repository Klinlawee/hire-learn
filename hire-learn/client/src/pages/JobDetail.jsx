import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal, { ConfirmationModal } from '../components/Modal'
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Users,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    fetchJobDetail()
  }, [id])

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/jobs/${id}`)
      setJob(response.data.data)
    } catch (error) {
      console.error('Error fetching job:', error)
      setError('Job not found or you may not have permission to view it.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }

    if (user.role !== 'employee') {
      alert('Only employees can apply to jobs.')
      return
    }

    setIsApplying(true)
    try {
      // In a real app, you would upload resume and submit application
      // For now, we'll simulate the application process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setApplicationSuccess(true)
      setShowApplyModal(false)
      
      // Refresh job data to update application count
      fetchJobDetail()
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('Failed to apply. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return 'Negotiable'
    
    const format = (amount) => {
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`
      return `$${amount}`
    }

    if (job.salary.min && job.salary.max) {
      return `${format(job.salary.min)} - ${format(job.salary.max)}/${job.salary.period}`
    }
    
    return job.salary.min 
      ? `From ${format(job.salary.min)}/${job.salary.period}`
      : `Up to ${format(job.salary.max)}/${job.salary.period}`
  }

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Job link copied to clipboard!')
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading job details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-error-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/jobs" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        {/* Job Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {job.company?.logo && (
                  <img
                    src={job.company.logo.url}
                    alt={job.company.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 mr-4"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center text-lg text-gray-600">
                    <Building className="w-5 h-5 mr-2" />
                    {job.company?.name}
                  </div>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span className="capitalize">{job.type?.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>{formatSalary()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="capitalize">{job.level}</span>
                </div>
              </div>

              {/* Remote & Category */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="badge-primary capitalize">
                  {job.remote}
                </span>
                <span className="badge-secondary capitalize">
                  {job.category}
                </span>
                {job.featured && (
                  <span className="badge-warning">
                    Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="badge-error">
                    Urgent
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-3 mt-4 lg:mt-0">
              <button
                onClick={shareJob}
                className="btn-outline flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="btn-outline flex items-center">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </button>
              {user?.role === 'employee' && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  disabled={applicationSuccess}
                  className={`btn-primary flex items-center ${
                    applicationSuccess ? 'bg-success-600 hover:bg-success-600' : ''
                  }`}
                >
                  {applicationSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            {job.company && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4">About the Company</h3>
                <div className="flex items-center mb-4">
                  {job.company.logo && (
                    <img
                      src={job.company.logo.url}
                      alt={job.company.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 mr-3"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{job.company.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{job.company.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {job.company.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{job.company.size} employees</span>
                  </div>
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Job Stats */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Job Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{job.applicationCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-medium">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{job.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ConfirmationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={handleApply}
        title="Apply for this Position"
        message="You're about to apply for this job. Make sure your profile and resume are up to date."
        confirmText={isApplying ? "Applying..." : "Submit Application"}
        cancelText="Cancel"
        isLoading={isApplying}
      />

      {/* Application Success Modal */}
      <Modal
        isOpen={applicationSuccess}
        onClose={() => setApplicationSuccess(false)}
        title="Application Submitted!"
        size="sm"
      >
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            Your application has been successfully submitted. The employer will review your profile and contact you if there's a match.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setApplicationSuccess(false)}
              className="btn-outline flex-1"
            >
              Close
            </button>
            <Link
              to="/employee/dashboard"
              className="btn-primary flex-1 text-center"
            >
              View Applications
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default JobDetail