import React from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  Clock,
  Users,
  PlayCircle,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react'

const CourseCard = ({ course, showEnrollButton = true, showInstructor = true }) => {
  const {
    _id,
    title,
    instructor,
    category,
    level,
    duration,
    price,
    thumbnail,
    rating,
    enrollmentCount,
    featured,
    certificate
  } = course

  // Format duration
  const formatDuration = () => {
    if (!duration) return 'Self-paced'
    return `${duration.value} ${duration.unit}`
  }

  // Format price
  const formatPrice = () => {
    if (price?.isFree) return 'Free'
    
    const currentPrice = course.currentPrice || price?.amount
    if (!currentPrice) return 'Free'
    
    return `$${currentPrice}`
  }

  // Calculate discount percentage
  const getDiscount = () => {
    if (price?.isFree || !price?.discount?.percentage) return null
    
    const hasValidDiscount = price.discount.percentage > 0 && 
      (!price.discount.validUntil || new Date(price.discount.validUntil) > new Date())
    
    return hasValidDiscount ? price.discount.percentage : null
  }

  const discount = getDiscount()

  return (
    <div className={`card card-hover relative ${featured ? 'ring-2 ring-primary-200' : ''}`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4">
          <span className="badge-primary">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </span>
        </div>
      )}

      {/* Certificate Badge */}
      {certificate?.included && (
        <div className="absolute top-4 right-4">
          <span className="badge-success">
            <Award className="w-3 h-3 mr-1" />
            Certificate
          </span>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative mb-4">
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-purple-400" />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <PlayCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Category & Level */}
      <div className="flex justify-between items-center mb-3">
        <span className="badge-secondary capitalize">
          {category?.replace('-', ' ')}
        </span>
        <span className="text-xs font-medium text-gray-500 capitalize">
          {level}
        </span>
      </div>

      {/* Course Title */}
      <Link to={`/courses/${_id}`} className="block group">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
          {title}
        </h2>
      </Link>

      {/* Instructor */}
      {showInstructor && instructor && (
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <span>By {instructor.name}</span>
        </div>
      )}

      {/* Course Stats */}
      <div className="space-y-2 mb-4">
        {/* Rating */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium text-gray-900">
                {rating?.average?.toFixed(1) || 'New'}
              </span>
            </div>
            {rating?.count > 0 && (
              <span className="text-gray-500 ml-1">
                ({rating.count})
              </span>
            )}
          </div>

          {/* Enrollment Count */}
          {enrollmentCount > 0 && (
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{enrollmentCount}</span>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>{formatDuration()}</span>
        </div>
      </div>

      {/* Price & Discount */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice()}
          </span>
          
          {discount && price?.amount && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ${price.amount}
              </span>
              <span className="badge-error">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Trending Badge */}
        {enrollmentCount > 100 && (
          <span className="badge-warning flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Popular
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link
          to={`/courses/${_id}`}
          className="btn-outline flex-1 text-center"
        >
          Preview
        </Link>
        
        {showEnrollButton && (
          <Link
            to={`/courses/${_id}`}
            className="btn-primary flex-1 text-center"
          >
            {price?.isFree ? 'Enroll Free' : 'Enroll Now'}
          </Link>
        )}
      </div>
    </div>
  )
}

export default CourseCard