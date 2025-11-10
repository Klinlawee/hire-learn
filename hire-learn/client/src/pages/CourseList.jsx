import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CourseCard from '../components/CourseCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'
import { Filter, Grid, List, SortAsc, Star, Users, Award } from 'lucide-react'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterAndSortCourses()
  }, [courses, searchTerm, filters, sortBy])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/courses', {
        params: { status: 'published' }
      })
      setCourses(response.data.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('Failed to load courses. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortCourses = () => {
    let filtered = [...courses]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(course => {
          if (key === 'minPrice') {
            const price = course.price?.isFree ? 0 : (course.currentPrice || course.price?.amount || 0)
            return price >= parseInt(value)
          }
          if (key === 'maxPrice') {
            const price = course.price?.isFree ? 0 : (course.currentPrice || course.price?.amount || 0)
            return price <= parseInt(value)
          }
          return course[key] === value
        })
      }
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
        case 'rating':
          return (b.rating?.average || 0) - (a.rating?.average || 0)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'price-high':
          return (b.price?.amount || 0) - (a.price?.amount || 0)
        case 'price-low':
          return (a.price?.amount || 0) - (b.price?.amount || 0)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error-600 text-lg mb-4">{error}</div>
          <button onClick={fetchCourses} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expand Your Skills
          </h1>
          <p className="text-lg text-gray-600">
            Discover {courses.length} courses to advance your career
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {courses.filter(course => course.featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured Courses</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {courses.filter(course => course.certificate?.included).length}
            </div>
            <div className="text-sm text-gray-600">With Certificates</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            placeholder="Search courses by title, instructor, or topic..."
            type="courses"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
            {searchTerm && ` for "${searchTerm}"`}
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm py-1"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <SkeletonLoader type="card" count={6} />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                showEnrollButton={true}
                showInstructor={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more courses.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({})
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredCourses.length > 0 && filteredCourses.length < courses.length && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList