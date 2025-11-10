import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building,
  Star,
  TrendingUp
} from 'lucide-react'

const JobCard = ({ job, showApplyButton = true, showEmployer = true }) => {
  const {
    _id,
    title,
    company,
    location,
    type,
    remote,
    salary,
    level,
    createdAt,
    featured,
    urgent,
    applicationCount
  } = job

  // Format salary display
  const formatSalary = () => {
    if (!salary?.min && !salary?.max) return 'Negotiable'
    
    const format = (amount) => {
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`
      return `$${amount}`
    }

    if (salary.min && salary.max) {
      return `${format(salary.min)} - ${format(salary.max)}`
    }
    
    return salary.min ? `From ${format(salary.min)}` : `Up to ${format(salary.max)}`
  }

  // Calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date()
    const posted = new Date(date)
    const diffTime = Math.abs(now - posted)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className={`card card-hover relative ${featured ? 'ring-2 ring-primary-200' : ''}`}>
      {/* Featured/Urgent Badges */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {featured && (
          <span className="badge-primary flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </span>
        )}
        {urgent && (
          <span className="badge-error">
            Urgent
          </span>
        )}
      </div>

      {/* Company Info */}
      {showEmployer && company && (
        <div className="flex items-center mb-4">
          {company.logo ? (
            <img
              src={company.logo.url}
              alt={company.name}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary-600" />
            </div>
          )}
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
      )}

      {/* Job Title */}
      <Link to={`/jobs/${_id}`} className="block group">
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 pr-20">
          {title}
        </h2>
      </Link>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        {/* Location & Remote */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{location}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{remote}</span>
        </div>

        {/* Job Type & Level */}
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          <span className="capitalize">{type?.replace('-', ' ')}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{level}</span>
        </div>

        {/* Salary */}
        {salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{formatSalary()}</span>
            {salary.period && (
              <>
                <span className="mx-2">•</span>
                <span className="capitalize">{salary.period}</span>
              </>
            )}
          </div>
        )}

        {/* Posted Time & Applications */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{getTimeAgo(createdAt)}</span>
          </div>
          
          {applicationCount > 0 && (
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{applicationCount} applications</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills/Tags */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Link
          to={`/jobs/${_id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View Details →
        </Link>

        {showApplyButton && (
          <Link
            to={`/jobs/${_id}`}
            className="btn-primary text-sm px-4 py-2"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  )
}

export default JobCard