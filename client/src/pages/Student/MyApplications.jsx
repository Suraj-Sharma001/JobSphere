import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getMyApplications } from '../../api/applicationApi';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState('all'); 
  const navigate = useNavigate();

  const fetchMyApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyApplications(currentPage, 10);
      setApplications(data?.applications || []);
      setPages(data?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchMyApplications();
  }, [user, navigate, currentPage, fetchMyApplications]);

  // Filter applications based on status
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter;
  });

  // Get status badge styling
  const getStatusStyle = (status) => {
    const styles = {
      'Placed': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Shortlisted': 'bg-blue-100 text-blue-800 border-blue-200',
      'Interview': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Placed': '🎉',
      'Rejected': '❌',
      'Pending': '⏳',
      'Shortlisted': '📋',
      'Interview': '🤝'
    };
    return icons[status] || '📄';
  };

  // Get application stats
  const getStats = () => {
    const total = applications.length;
    const placed = applications.filter(app => app.status === 'Placed').length;
    const pending = applications.filter(app => app.status === 'Pending').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    return { total, placed, pending, rejected };
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
            My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">Track your job applications and their current status</p>
        </div>

        {/* Stats Overview */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Applied</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-blue-600 text-2xl">📊</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Placed</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.placed}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-green-600 text-2xl">🎉</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-yellow-600 text-2xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {stats.total > 0 ? Math.round((stats.placed / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <span className="text-indigo-600 text-2xl">📈</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-4 mb-8">
            <div className="flex flex-wrap gap-3">
              {['all', 'pending', 'shortlisted', 'interview', 'placed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2 rounded-full text-base font-semibold transition-colors duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 text-sm opacity-75">
                      ({applications.filter(app => app.status.toLowerCase() === status).length})
                    </span>
                  )}
                  {status === 'all' && (
                    <span className="ml-2 text-sm opacity-75">({applications.length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              {filter === 'all' ? 'No Applications Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {filter === 'all' 
                ? "You haven't applied for any jobs yet. Start exploring opportunities!" 
                : `You don't have any ${filter} applications at the moment.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/dashboard')}
                className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🔍</span>
                Explore Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Application Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                        {app.job?.title || 'Job Title N/A'}
                      </h3>
                      <p className="text-gray-600 text-lg font-medium">
                        {app.job?.company?.company_name || 'Company N/A'}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(app.status)}`}>
                      <span className="mr-2 text-base">{getStatusIcon(app.status)}</span>
                      {app.status}
                    </div>
                  </div>
                  
                  {app.job?.description && (
                    <p className="text-gray-600 text-base line-clamp-2 mb-3 leading-relaxed">
                      {app.job.description}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 font-medium mt-4">
                    <span className="mr-1 text-blue-500">📅</span>
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Application Footer */}
                <div className="p-6 pt-4">
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="flex-1 group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => navigate('/feedback', { state: { jobId: app.job?._id } })}
                    >
                      <span className="mr-2">📝</span>
                      Submit Feedback
                    </button>
                    {app.job?._id && (
                      <button
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate(`/job/${app.job._id}`)}
                      >
                        <span className="mr-2">👀</span>
                        View Job
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                    x + 1 === currentPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;