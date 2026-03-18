import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchJobs } from '../services/api'

const Homepage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        const jobs = await fetchJobs({ limit: 6 })
        setFeaturedJobs(jobs)
      } catch (error) {
        console.error('Error loading featured jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedJobs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your <span className="text-yellow-400">Dream Job</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Connect with top employers and discover opportunities that match your skills and aspirations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/jobs" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Browse Jobs
                </Link>
                <Link to="/register" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200">
                  Create Account
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/30">
                  <div className="text-3xl mb-3">💼</div>
                  <div className="text-white font-semibold">Remote Work</div>
                  <div className="text-blue-100 text-sm">Work from anywhere</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/30 mt-8">
                  <div className="text-3xl mb-3">�</div>
                  <div className="text-white font-semibold">Career Growth</div>
                  <div className="text-blue-100 text-sm">Advance your skills</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/30">
                  <div className="text-3xl mb-3">💰</div>
                  <div className="text-white font-semibold">Competitive Pay</div>
                  <div className="text-blue-100 text-sm">Earn what you deserve</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/30 mt-8">
                  <div className="text-3xl mb-3">🎯</div>
                  <div className="text-white font-semibold">Perfect Match</div>
                  <div className="text-blue-100 text-sm">AI-powered matching</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose JobPortal?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of job searching with our cutting-edge features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Job Matching</h3>
              <p className="text-gray-600">Our AI-powered system matches you with jobs that perfectly fit your skills and preferences</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Prompts</h3>
              <p className="text-gray-600">Get professional help with resume writing, interview preparation, and career advice</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Analytics</h3>
              <p className="text-gray-600">Track your job applications and get insights to improve your job search strategy</p>
            </div>
            <div className="text-center group">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                <span className="text-2xl group-hover:text-white">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Platform</h3>
              <p className="text-gray-600">Your data is protected with industry-standard security measures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-lg text-gray-600">Discover the latest opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
              View All Jobs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading featured jobs...</p>
            </div>
          ) : !Array.isArray(featuredJobs) || featuredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured jobs available at the moment.</p>
              <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold">
                Browse All Jobs
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                          <img src={job.companyLogo || '/api/placeholder/50/50'} alt={job.company} className="w-8 h-8 rounded" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        📍 {job.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        💰 {job.salary}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                        ⏰ {job.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {job.description?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Posted {job.postedDate}</span>
                      <Link 
                        to={`/jobs/${job.id}`} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of job seekers who found their dream jobs through JobPortal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Get Started Now
            </Link>
            <Link to="/prompts" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200">
              Try AI Prompts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
