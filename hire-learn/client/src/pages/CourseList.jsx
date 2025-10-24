import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, Clock, Users, BookOpen, Grid, List, SlidersHorizontal } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import { toast } from 'react-hot-toast'

const CourseList = () => {
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    duration: '',
    price: '',
    search: ''
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from API
  const mockCourses = [
    {
      id: 1,
      title: 'React Masterclass 2024',
      instructor: 'John Doe',
      description: 'Learn React from basics to advanced concepts with hands-on projects and real-world applications.',
      duration: '12 hours',
      level: 'Intermediate',
      students: 2500,
      rating: 4.8,
      price: 89.99,
      originalPrice: 129.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Web Development',
      featured: true,
      isEnrolled: false,
      isCompleted: false
    },
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
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      description: 'Master the principles of user interface and experience design with practical examples.',
      duration: '8 hours',
      level: 'Beginner',
      students: 3200,
      rating: 4.9,
      price: 69.99,
      originalPrice: 99.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Design',
      featured: true,
      isEnrolled: false,
      isCompleted: false
    },
    {
      id: 4,
      title: 'Python for Data Science',
      instructor: 'Sarah Wilson',
      description: 'Learn Python programming and data analysis with real-world projects and datasets.',
      duration: '20 hours',
      level: 'Intermediate',
      students: 4200,
      rating: 4.6,
      price: 79.99,
      originalPrice: 119.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Data Science',
      featured: false,
      isEnrolled: false,
      isCompleted: false
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
    },
    {
      id: 6,
      title: 'AWS Cloud Practitioner',
      instructor: 'Emily Davis',
      description: 'Prepare for AWS certification with comprehensive cloud training and hands-on labs.',
      duration: '10 hours',
      level: 'Beginner',
      students: 2800,
      rating: 4.8,
      price: 89.99,
      originalPrice: 129.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Cloud Computing',
      featured: true,
      isEnrolled: false,
      isCompleted: false
    },
    {
      id: 7,
      title: 'JavaScript Fundamentals',
      instructor: 'David Brown',
      description: 'Master JavaScript basics and advanced concepts with interactive coding exercises.',
      duration: '6 hours',
      level: 'Beginner',
      students: 5100,
      rating: 4.5,
      price: 49.99,
      originalPrice: 79.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Web Development',
      featured: false,
      isEnrolled: false,
      isCompleted: false
    },
    {
      id: 8,
      title: 'Machine Learning with Python',
      instructor: 'Lisa Wang',
      description: 'Learn machine learning algorithms and implement them using Python and scikit-learn.',
      duration: '25 hours',
      level: 'Advanced',
      students: 2300,
      rating: 4.7,
      price: 119.99,
      originalPrice: 169.99,
      thumbnail: '/api/placeholder/300/200',
      category: 'Data Science',
      featured: false,
      isEnrolled: false,
      isCompleted: false
    }
  ]

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Design',
    'Cloud Computing',
    'Business',
    'Marketing'
  ]

  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
  const durations = ['Any', '0-5 hours', '5-10 hours', '10-20 hours', '20+ hours']
  const prices = ['Any', 'Free', 'Paid']

  useEffect(() => {
    // Simulate API call
    const fetchCourses = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCourses(mockCourses)
      } catch (error) {
        toast.error('Failed to load courses')
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      duration: '',
      price: '',
      search: ''
    })
  }

  // Filter courses based on current filters
  const filteredCourses = courses.filter(course => {
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !course.instructor.toLowerCase().includes(filters.search.toLowerCase()) &&
        !course.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category && filters.category !== 'All Categories' && course.category !== filters.category) {
      return false
    }
    if (filters.difficulty && filters.difficulty !== 'All Levels' && course.level !== filters.difficulty) {
      return false
    }
    if (filters.price === 'Free' && course.price > 0) {
      return false
    }
    if (filters.price === 'Paid' && course.price === 0) {
      return false
    }
    return true
  })

  const enrolledCourses = courses.filter(course => course.isEnrolled)
  const completedCourses = courses.filter(course => course.isCompleted)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your skills with our comprehensive course catalog. Learn from industry experts and advance your career.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-primary-600 mb-2">{courses.length}</div>
            <div className="text-gray-600">Total Courses</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-primary-600 mb-2">{enrolledCourses.length}</div>
            <div className="text-gray-600">Enrolled Courses</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-primary-600 mb-2">{completedCourses.length}</div>
            <div className="text-gray-600">Completed Courses</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
                value={filters.search}
                onChange={handleSearchChange}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  className="input-field w-full"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select 
                  className="input-field w-full"
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  {difficulties.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select 
                  className="input-field w-full"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select 
                  className="input-field w-full"
                  value={filters.price}
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                  {prices.map(price => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all courses.</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Browse All Courses
            </button>
          </div>
        ) : (
          <>
            {/* Enrolled Courses Section */}
            {enrolledCourses.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
                  <Link 
                    to="/employee/dashboard?tab=courses" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All Enrolled
                  </Link>
                </div>
                <div className={`gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'space-y-6'
                }`}>
                  {enrolledCourses.slice(0, viewMode === 'grid' ? 3 : 2).map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      variant={viewMode}
                      showProgress={true}
                      showStats={viewMode === 'grid'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Courses Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filters.search ? 'Search Results' : 'All Courses'}
                </h2>
                <div className="text-sm text-gray-600">
                  {filteredCourses.length} courses found
                </div>
              </div>

              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'space-y-6'
              } gap-6`}>
                {filteredCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    variant={viewMode}
                    showProgress={course.isEnrolled}
                    showStats={viewMode === 'grid'}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Load More */}
        {filteredCourses.length > 0 && filteredCourses.length < courses.length && (
          <div className="text-center mt-12">
            <button className="btn-secondary px-8 py-3">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList