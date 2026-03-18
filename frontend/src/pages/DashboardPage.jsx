import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchUserApplications, fetchDashboardData, fetchResumes } from '../services/api'

const DashboardPage = ({ user }) => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [applications, setApplications] = useState([])
  const [resumes, setResumes] = useState([])
  const [dashboardData, setDashboardData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab')
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [location.search])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appsData, resumesData, dashboardInfo] = await Promise.all([
          fetchUserApplications(),
          fetchResumes(),
          fetchDashboardData()
        ])
        setApplications(appsData.data || [])
        setResumes(resumesData.data || [])
        setDashboardData(dashboardInfo.data || {})
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      interviewing: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      reviewed: '👀',
      interviewing: '📅',
      accepted: '✅',
      rejected: '❌'
    }
    return icons[status] || '📋'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-lg text-gray-600">Manage your job search and career development</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{dashboardData.totalApplications || 0}</h3>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <span className="text-2xl">👀</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{dashboardData.viewedApplications || 0}</h3>
                <p className="text-gray-600">Applications Viewed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{dashboardData.interviews || 0}</h3>
                <p className="text-gray-600">Interviews Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{resumes.length}</h3>
                <p className="text-gray-600">Resumes Uploaded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: '📈 Overview', icon: '📈' },
                { id: 'applications', label: '📋 Applications', icon: '📋' },
                { id: 'resumes', label: '📄 Resumes', icon: '📄' },
                { id: 'profile', label: '👤 Profile', icon: '👤' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                    {applications.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-gray-600 mb-4">No applications yet</p>
                        <Link to="/jobs" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Start browsing jobs!
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {applications.slice(0, 5).map(app => (
                          <div key={app.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{app.jobTitle}</h4>
                              <p className="text-gray-600 text-sm">{app.company}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {getStatusIcon(app.status)} {app.status}
                              </span>
                              <p className="text-gray-500 text-xs mt-1">{app.appliedDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Link to="/jobs" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                        <div className="text-2xl mb-2">🔍</div>
                        <h4 className="font-medium text-gray-900">Browse Jobs</h4>
                        <p className="text-gray-600 text-sm">Find new opportunities</p>
                      </Link>
                      <Link to="/prompts" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                        <div className="text-2xl mb-2">🤖</div>
                        <h4 className="font-medium text-gray-900">AI Prompts</h4>
                        <p className="text-gray-600 text-sm">Get career assistance</p>
                      </Link>
                      <button 
                        onClick={() => setActiveTab('resumes')}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
                      >
                        <div className="text-2xl mb-2">📄</div>
                        <h4 className="font-medium text-gray-900">Upload Resume</h4>
                        <p className="text-gray-600 text-sm">Add new resume</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
                      >
                        <div className="text-2xl mb-2">⚙️</div>
                        <h4 className="font-medium text-gray-900">Update Profile</h4>
                        <p className="text-gray-600 text-sm">Keep info current</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
                  <Link to="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply for Jobs
                  </Link>
                </div>
                {applications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-6xl mb-4">📋</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h4>
                    <p className="text-gray-600 mb-6">Start applying for jobs to track your progress here.</p>
                    <Link to="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map(app => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.jobTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appliedDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {getStatusIcon(app.status)} {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resumes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Resumes</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload New Resume
                  </button>
                </div>
                {resumes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-6xl mb-4">📄</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No resumes uploaded</h4>
                    <p className="text-gray-600 mb-6">Upload your resume to apply for jobs faster.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Upload Resume
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map(resume => (
                      <div key={resume.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-2 mr-3">
                              <span className="text-xl">📄</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{resume.fileName}</h4>
                              <p className="text-gray-600 text-sm">Uploaded {resume.uploadDate}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm">
                            View
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm">
                            Download
                          </button>
                          <button className="border border-red-300 text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <div className="max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        placeholder="Add your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mt-6">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
