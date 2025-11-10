import React, { useState, useEffect } from 'react'
import { Search, Filter, X, MapPin, Briefcase, DollarSign } from 'lucide-react'

const SearchBar = ({
  onSearch,
  onFiltersChange,
  placeholder = "Search jobs...",
  type = "jobs", // "jobs" or "courses"
  initialFilters = {},
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [showFilters, setShowFilters] = useState(false)

  // Job-specific filters
  const jobFilters = {
    location: '',
    category: '',
    type: '',
    remote: '',
    level: '',
    minSalary: '',
    maxSalary: ''
  }

  // Course-specific filters
  const courseFilters = {
    category: '',
    level: '',
    instructor: '',
    minPrice: '',
    maxPrice: ''
  }

  const availableFilters = type === 'jobs' ? jobFilters : courseFilters

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = Object.fromEntries(
      Object.keys(filters).map(key => [key, ''])
    )
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const clearSearch = () => {
    setSearchTerm('')
    onSearch?.('')
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="input pl-10 pr-10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} flex items-center`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full"></span>
            )}
          </button>

          <button
            type="submit"
            className="btn-primary px-6"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Common Filters */}
            {type === 'jobs' ? (
              <>
                {/* Location */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="City, state, or remote"
                    className="input"
                  />
                </div>

                {/* Job Category */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    <option value="technology">Technology</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="hr">Human Resources</option>
                    <option value="operations">Operations</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                {/* Job Type */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Job Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="input"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Remote Work */}
                <div className="form-group">
                  <label className="form-label">Remote</label>
                  <select
                    value={filters.remote || ''}
                    onChange={(e) => handleFilterChange('remote', e.target.value)}
                    className="input"
                  >
                    <option value="">Any</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select
                    value={filters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="input"
                  >
                    <option value="">Any Level</option>
                    <option value="intern">Intern</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Min Salary
                  </label>
                  <input
                    type="number"
                    value={filters.minSalary || ''}
                    onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                    placeholder="0"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Salary</label>
                  <input
                    type="number"
                    value={filters.maxSalary || ''}
                    onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                    placeholder="No limit"
                    className="input"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Course Category */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="business">Business</option>
                    <option value="photography">Photography</option>
                    <option value="music">Music</option>
                    <option value="health">Health & Fitness</option>
                    <option value="language">Language</option>
                  </select>
                </div>

                {/* Course Level */}
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    value={filters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="input"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all-levels">All Levels</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="form-group">
                  <label className="form-label">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="No limit"
                    className="input"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar