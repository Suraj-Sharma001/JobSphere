import React, { useEffect, useState, useContext } from "react";
import { getJobs } from "../../api/jobApi";
import { applyJob } from "../../api/applicationApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import JobCard from "../../components/JobCard";

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
      return;
    }
    fetchJobs();
  }, [user, navigate, currentPage, branch, cgpa, keyword]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getJobs({
        page: currentPage,
        limit: 10,
        branch,
        cgpa,
        keyword,
      });
      setJobs(data.jobs);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      await applyJob(id);
      // Use a more elegant notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      notification.textContent = '✅ Application submitted successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Already applied or error");
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setBranch("");
    setCgpa("");
    setKeyword("");
    setCurrentPage(1);
  };

  const hasActiveFilters = branch || cgpa || keyword;

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-10 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {user?.name || 'Student'}
                </span>
                ! 👋
              </h1>
              <p className="text-gray-600 text-lg md:text-xl">Track your placement journey and discover new opportunities</p>
            </div>
            <div className="mt-6 sm:mt-0">
              <Link 
                to="/my-applications" 
                className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">📋</span>
                My Applications
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Applications Sent</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  12 
                  <span className="text-green-500 text-sm ml-2 bg-green-50 px-2 py-1 rounded-full">
                    ↗️ +3 this week
                  </span>
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-2xl">🚀</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  4 
                  <span className="text-yellow-600 text-sm ml-2 bg-yellow-50 px-2 py-1 rounded-full">
                    ⭐ 33% rate
                  </span>
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-yellow-600 text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Interviews</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  2 
                  <span className="text-green-600 text-sm ml-2 bg-green-50 px-2 py-1 rounded-full">
                    🗓️ 1 upcoming
                  </span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-2xl">🤝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Profile Score</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  85%
                  <span className="text-blue-600 text-sm ml-2 bg-blue-50 px-2 py-1 rounded-full">
                    ✅ Complete
                  </span>
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <span className="text-indigo-600 text-2xl">👤</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Available Opportunities */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-900">Available Opportunities</h2>
                <span className="text-gray-600 text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-medium">
                  {jobs.length} jobs found
                </span>
              </div>

              {/* Enhanced Filters */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">🔍 Filter Opportunities</h3>
                  <button
                    onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                    className="text-blue-600 text-sm hover:text-blue-800 transition-colors font-medium"
                  >
                    {isFiltersExpanded ? '▲ Collapse' : '▼ Expand'}
                  </button>
                </div>
                
                <div className={`space-y-4 ${isFiltersExpanded ? 'block' : 'hidden sm:block'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      >
                        <option value="">All Branches</option>
                        <option value="CSE">Computer Science</option>
                        <option value="IT">Information Technology</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="MECH">Mechanical Engineering</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                      <input
                        type="number"
                        placeholder="e.g., 7.5"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        step="0.1"
                        min="0"
                        max="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <input
                        type="text"
                        placeholder="e.g., Software Engineer"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      />
                    </div>
                    
                    <div className="flex flex-col justify-end space-y-2">
                      <button
                        onClick={handleFilter}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        🔍 Apply Filters
                      </button>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-gray-600 text-sm hover:text-gray-800 transition-colors font-medium"
                        >
                          ✖️ Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="p-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    {hasActiveFilters 
                      ? "Try adjusting your filters to see more opportunities" 
                      : "New opportunities will appear here when available"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} onApply={handleApply} />
                  ))}
                </div>
              )}

              {/* Enhanced Pagination */}
              {pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-1 bg-blue-50 rounded-lg p-1 border border-blue-100">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-700 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      ← Previous
                    </button>
                    {[...Array(pages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => setCurrentPage(x + 1)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          x + 1 === currentPage
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-blue-700 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(pages, currentPage + 1))}
                      disabled={currentPage === pages}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        currentPage === pages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-700 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Upcoming Deadlines */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center">
                ⏰ Upcoming Deadlines
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">ConsultPro Services</p>
                  <span className="text-red-700 text-xs bg-red-100 px-2 py-1 rounded-full font-medium">URGENT</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Application deadline: <span className="font-bold text-red-600">2 days (Dec 20)</span>
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">FinanceFlow Ltd</p>
                  <span className="text-yellow-700 text-xs bg-yellow-100 px-2 py-1 rounded-full font-medium">SOON</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Interview prep: <span className="font-bold text-yellow-700">1 day (Dec 18)</span>
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">GlobalTech Innovations</p>
                  <span className="text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full font-medium">AHEAD</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Assessment due: <span className="font-bold text-green-700">5 days (Dec 23)</span>
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="p-6 bg-blue-50 rounded-b-2xl border-t border-blue-100">
              <h3 className="font-bold text-gray-800 mb-3">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  to="/profile" 
                  className="block w-full text-left p-3 text-base text-blue-700 hover:bg-white hover:shadow-md rounded-lg transition-colors duration-200 font-medium border border-blue-100 hover:border-blue-200"
                >
                  📝 Update Profile
                </Link>
                <Link 
                  to="/resume" 
                  className="block w-full text-left p-3 text-base text-blue-700 hover:bg-white hover:shadow-md rounded-lg transition-colors duration-200 font-medium border border-blue-100 hover:border-blue-200"
                >
                  📄 Upload Resume
                </Link>
                <Link 
                  to="/feedback" 
                  className="block w-full text-left p-3 text-base text-blue-700 hover:bg-white hover:shadow-md rounded-lg transition-colors duration-200 font-medium border border-blue-100 hover:border-blue-200"
                >
                  💬 Give Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;