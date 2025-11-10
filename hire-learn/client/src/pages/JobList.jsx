import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'
import { Filter, Grid, List, SortAsc } from 'lucide-react'

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchTerm, filters, sortBy])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/jobs')
      setJobs(response.data.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setError('Failed to load jobs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(job => {
          if (key === 'location') {
            return job.location.toLowerCase().includes(value.toLowerCase())
          }
          if (key === 'minSalary' && job.salary?.min) {
            return job.salary.min >= parseInt(value)
          }
          if (key === 'maxSalary' && job.salary?.max) {
            return job.salary.max <= parseInt(value)
          }
          return job[key] === value
        })
      }
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'salary-high':
          return (b.salary?.max || 0) - (a.salary?.max || 0)
        case 'salary-low':
          return (a.salary?.min || 0) - (b.salary?.min || 0)
        case 'applications':
          return (b.applicationCount || 0) - (a.applicationCount || 0)
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
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
          <button onClick={fetchJobs} className="btn-primary">
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
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600">
            Discover {jobs.length} opportunities from top companies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            placeholder="Search jobs by title, company, or skills..."
            type="jobs"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="applications">Most Applications</option>
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

        {/* Jobs Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            <SkeletonLoader type="card" count={6} />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredJobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                showApplyButton={true}
                showEmployer={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more opportunities.
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
        {filteredJobs.length > 0 && filteredJobs.length < jobs.length && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList