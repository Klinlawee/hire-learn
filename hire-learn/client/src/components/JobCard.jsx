import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building, 
  Bookmark, 
  Share2, 
  CheckCircle,
  Star
} from 'lucide-react'

const JobCard = ({ 
  job, 
  variant = 'default',
  showCompany = true,
  showActions = true,
  showMatchScore = false,
  isSaved = false,
  onSave,
  onShare,
  onQuickApply
}) => {
  const [saved, setSaved] = useState(isSaved)

  const {
    id,
    title,
    company,
    logo,
    location,
    type,
    salary,
    experience,
    skills = [],
    posted,
    urgent,
    featured,
    matchScore,
    isApplied,
    applicationStatus,
    remote
  } = job

  const isGrid = variant === 'grid'
  const isList = variant === 'list'
  const isCompact = variant === 'compact'

  // Format posted date
  const formatPostedDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  // Handle save job
  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
    onSave?.(id, !saved)
  }

  // Handle share job
  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(id)
  }

  // Handle quick apply
  const handleQuickApply = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickApply?.(id)
  }

  // Compact variant for saved jobs or search results
  if (isCompact) {
    return (
      <div className="card hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center space-x-4 p-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={company} className="w-8 h-8 object-contain" />
              ) : (
                <Building className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <span>{company}</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">{salary}</span>
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                saved 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List variant for search results
  if (isList) {
    return (
      <div className="card hover:shadow-lg transition-shadow duration-300 group">
        <div className="flex items-start space-x-6 p-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border">
              {logo ? (
                <img src={logo} alt={company} className="w-10 h-10 object-contain" />
              ) : (
                <Building className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  <Link to={`/jobs/${id}`}>
                    {title}
                  </Link>
                </h3>
                
                {showCompany && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{company}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{location}</span>
                    {remote && (
                      <span className="ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{type}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatPostedDate(posted)}</span>
                  </div>
                  {experience && (
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {experience}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Score */}
              {showMatchScore && matchScore && (
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {matchScore}% Match
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-gray-500 text-xs">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-900">{salary}</span>
              </div>

              {showActions && (
                <div className="flex items-center space-x-3">
                  {urgent && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      Urgent
                    </span>
                  )}
                  {featured && (
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </span>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share job"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSave}
                    className={`p-2 rounded transition-colors ${
                      saved 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={saved ? 'Remove from saved' : 'Save job'}
                  >
                    <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                  </button>

                  {isApplied ? (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Applied
                    </div>
                  ) : (
                    <button
                      onClick={handleQuickApply}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Quick Apply
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default grid variant
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Job Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border">
              {logo ? (
                <img src={logo} alt={company} className="w-8 h-8 object-contain" />
              ) : (
                <Building className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                <Link to={`/jobs/${id}`}>
                  {title}
                </Link>
              </h3>
              {showCompany && (
                <p className="text-gray-600 text-sm mt-1">{company}</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          {showActions && (
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                saved 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={saved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {urgent && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
              Urgent
            </span>
          )}
          {featured && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
          {remote && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              Remote
            </span>
          )}
          {experience && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {experience}
            </span>
          )}
        </div>

        {/* Match Score */}
        {showMatchScore && matchScore && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Match score</span>
              <span>{matchScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>{type}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatPostedDate(posted)}</span>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Salary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-900">{salary}</span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2">
              {isApplied ? (
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Applied
                </div>
              ) : (
                <button
                  onClick={handleQuickApply}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Default props
JobCard.defaultProps = {
  job: {
    id: 1,
    title: 'Job Title',
    company: 'Company Name',
    logo: null,
    location: 'Location',
    type: 'Full-time',
    salary: 'Not specified',
    experience: 'Mid Level',
    skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    posted: new Date().toISOString(),
    urgent: false,
    featured: false,
    remote: false,
    matchScore: null,
    isApplied: false,
    applicationStatus: null
  }
}

export default JobCard