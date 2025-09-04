import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../api/jobApi';
import { applyJob } from '../api/applicationApi';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data } = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      // Show elegant notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = '⚠️ Only students can apply for jobs.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      return;
    }

    setIsApplying(true);
    try {
      await applyJob(id);
      setApplySuccess(true);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = '🎉 Application submitted successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    return salary.toString().includes('LPA') ? salary : `₹${salary} LPA`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
        <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Jobs
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors mb-6 text-lg font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex items-center text-lg text-gray-600 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <span className="text-blue-600 text-xl">🏢</span>
                    </div>
                    <span className="font-semibold">{job.company?.company_name || 'Company Name Not Available'}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      💼 Full Time
                    </span>
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      🎓 Campus Hiring
                    </span>
                    {job.criteria_branch && (
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        📚 {job.criteria_branch}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Salary Package</p>
                    <p className="text-lg font-bold text-gray-900">{formatSalary(job.salary)}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <span className="text-blue-600 text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-lg font-bold text-gray-900">{job.location || 'Location TBD'}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <span className="text-yellow-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Required CGPA</p>
                    <p className="text-lg font-bold text-gray-900">{job.criteria_cgpa}+ / 10.0</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <span className="text-purple-600 text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Posted On</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-full mr-3">
                    <span className="text-blue-600 text-xl">📄</span>
                  </span>
                  Job Description
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {job.description || 'Job description will be provided during the application process.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(job.requirements || job.benefits) && (
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {job.requirements && (
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center">
                        <span className="bg-red-100 p-2 rounded-full mr-3">
                          <span className="text-red-600 text-lg">📋</span>
                        </span>
                        Requirements
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
                    </div>
                  )}
                  
                  {job.benefits && (
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center">
                        <span className="bg-green-100 p-2 rounded-full mr-3">
                          <span className="text-green-600 text-lg">🎁</span>
                        </span>
                        Benefits
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{job.benefits}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
              <h3 className="text-xl font-extrabold text-gray-900 mb-4">Application Status</h3>
              
              {!user ? (
                <div className="text-center">
                  <div className="bg-gray-100 p-4 rounded-xl mb-4">
                    <span className="text-4xl">🔐</span>
                  </div>
                  <p className="text-gray-600 mb-4">You need to be logged in to apply</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Login to Apply
                  </button>
                </div>
              ) : user.role !== 'student' ? (
                <div className="text-center">
                  <div className="bg-yellow-100 p-4 rounded-xl mb-4">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <p className="text-gray-600">Only students can apply for jobs</p>
                </div>
              ) : applySuccess ? (
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-xl mb-4">
                    <span className="text-4xl">✅</span>
                  </div>
                  <p className="text-green-700 font-semibold mb-4">Application Submitted!</p>
                  <p className="text-gray-600 text-sm">You'll hear back from the company soon.</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Ready to take the next step in your career?</p>
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                      isApplying
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {isApplying ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Apply Now
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Company Info */}
            {job.company && (
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-4">About Company</h3>
                <div className="text-center mb-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-2xl">🏢</span>
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900">{job.company.company_name}</h4>
                </div>
                
                {job.company.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.company.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-700">
                  {job.company.industry && (
                    <p><span className="font-medium text-gray-900">Industry:</span> {job.company.industry}</p>
                  )}
                  {job.company.size && (
                    <p><span className="font-medium text-gray-900">Company Size:</span> {job.company.size}</p>
                  )}
                  {job.company.website && (
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      🌐 Visit Website
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Application Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Ensure your profile is complete and up-to-date
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Upload your latest resume before applying
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Check eligibility criteria carefully
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Apply early for better chances
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;