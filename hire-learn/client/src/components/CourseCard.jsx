import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Users, BookOpen, PlayCircle, CheckCircle } from 'lucide-react'

const CourseCard = ({ 
  course, 
  variant = 'default',
  showInstructor = true,
  showStats = true,
  showProgress = false,
  progress = 0 
}) => {
  const {
    id,
    title,
    instructor,
    description,
    duration,
    level,
    students,
    rating,
    price,
    originalPrice,
    thumbnail,
    category,
    featured,
    isEnrolled,
    isCompleted
  } = course

  const isGrid = variant === 'grid'
  const isList = variant === 'list'
  const isCompact = variant === 'compact'

  // Calculate discount percentage
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0

  // Render different variants
  if (isCompact) {
    return (
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center space-x-4 p-4">
          <div className="relative flex-shrink-0">
            <img
              src={thumbnail}
              alt={title}
              className="w-16 h-12 object-cover rounded-lg"
            />
            {featured && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            <p className="text-sm text-gray-600 truncate">{instructor}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">${price}</span>
            {isEnrolled && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isList) {
    return (
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="flex">
          {/* Course Thumbnail */}
          <div className="flex-shrink-0 w-48 relative">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover rounded-l-lg"
            />
            {featured && (
              <span className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                Featured
              </span>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Course Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {level}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {category}
                  </span>
                  {featured && (
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/courses/${id}`} className="hover:text-primary-600 transition-colors">
                    {title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
                
                {showInstructor && (
                  <p className="text-sm text-gray-500 mb-4">By {instructor}</p>
                )}
              </div>
            </div>

            {/* Course Stats and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {showStats && (
                  <>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{rating}</span>
                    </div>
                  </>
                )}
                
                {showProgress && (
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">${price}</span>
                  {originalPrice && (
                    <span className="text-sm text-gray-500 line-through block">${originalPrice}</span>
                  )}
                </div>
                <Link 
                  to={`/courses/${id}`}
                  className="btn-primary px-6 py-2"
                >
                  {isEnrolled ? 'Continue' : 'Enroll Now'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default grid variant
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Course Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
            Featured
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            {discount}% OFF
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            level === 'Beginner' ? 'bg-green-100 text-green-800' :
            level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {level}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{rating}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link to={`/courses/${id}`}>
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Instructor */}
        {showInstructor && (
          <p className="text-sm text-gray-500 mb-4">By {instructor}</p>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{students.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{category}</span>
            </div>
          </div>
        )}

        {/* Progress Bar (for enrolled courses) */}
        {showProgress && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isEnrolled && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <Link 
              to={`/courses/${id}`}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                isEnrolled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'btn-primary'
              }`}
            >
              {isEnrolled ? 'Continue' : 'Enroll Now'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default props
CourseCard.defaultProps = {
  course: {
    id: 1,
    title: 'Course Title',
    instructor: 'Instructor Name',
    description: 'Course description goes here...',
    duration: '10 hours',
    level: 'Beginner',
    students: 1000,
    rating: 4.5,
    price: 99.99,
    originalPrice: null,
    thumbnail: '/api/placeholder/300/200',
    category: 'Category',
    featured: false,
    isEnrolled: false,
    isCompleted: false
  }
}

export default CourseCard