import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import React from 'react'
import { fetchJobs } from '../services/api'

const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    salary: '',
    page: 1
  })
  const [pagination, setPagination] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      try {
        const response = await fetchJobs(filters)
        setJobs(response.jobs || response)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } catch (error) {
        console.error('Error loading jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      salary: '',
      page: 1
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Job</h1>
          <p className="text-lg text-gray-600">Discover opportunities from top companies</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search by job title, company, or keywords..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="new-york">New York</option>
                  <option value="san-francisco">San Francisco</option>
                  <option value="london">London</option>
                  <option value="berlin">Berlin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <select
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Salaries</option>
                  <option value="0-50k">$0 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-150k">$100,000 - $150,000</option>
                  <option value="150k+">$150,000+</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Searching...' : `Found ${pagination.total || jobs.length} jobs`}
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Newest</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Relevant</button>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img 
                              src={job.companyLogo || '/api/placeholder/60/60'} 
                              alt={job.company} 
                              className="w-8 h-8 rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              <Link to={`/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">
                                {job.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                ⏰ {job.type}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                📍 {job.location}
                              </span>
                              {job.remote && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                  🏠 Remote
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {job.description?.substring(0, 200)}...
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                💰 {job.salary}
                              </span>
                              <span className="flex items-center">
                                📅 Posted {job.postedDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 md:items-start">
                        <Link 
                          to={`/jobs/${job.id}`} 
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
                        >
                          View Details
                        </Link>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Quick Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1
                  const isActive = page === pagination.currentPage
                  const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2 || page === 1 || page === pagination.totalPages
                  
                  if (!isNearCurrent && page !== 1 && page !== pagination.totalPages) {
                    return null
                  }
                  
                  if (!isNearCurrent && page === 1) {
                    return (
                      <React.Fragment key="ellipsis-start">
                        <button
                          key={page}
                          className={`px-4 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                        <span key="ellipsis-start-text" className="px-2">...</span>
                      </React.Fragment>
                    )
                  }
                  
                  if (!isNearCurrent && page === pagination.totalPages) {
                    return (
                      <React.Fragment key="ellipsis-end">
                        <span key="ellipsis-end-text" className="px-2">...</span>
                        <button
                          key={page}
                          className={`px-4 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    )
                  }
                  
                  return (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobsPage
