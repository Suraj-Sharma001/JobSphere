import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  getRecruiterApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} from '../../api/applicationApi';
import { getMyJobs } from '../../api/jobApi';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/Loader';

const ManageApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchRecruiterData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: jobsData } = await getMyJobs(1, 10); // Fetch all recruiter's jobs without pagination for the filter dropdown
      setJobs(jobsData?.jobs || []); // Assuming getMyJobs returns an object with a 'jobs' array

      let applicationsData;
      let totalPages;

      if (selectedJob) {
        const { data } = await getApplicationsByJob(selectedJob, currentPage, 10);
        applicationsData = data?.applications || [];
        totalPages = data?.pages || 1;
      } else {
        const { data } = await getRecruiterApplications(currentPage, 10);
        applicationsData = data?.applications || [];
        totalPages = data?.pages || 1;
      }
      setApplications(applicationsData);
      setPages(totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedJob, currentPage]);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('jobId');
    if (jobId) {
      setSelectedJob(jobId);
    }

    fetchRecruiterData();
  }, [user, navigate, location.search, currentPage, selectedJob, fetchRecruiterData]);

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status });
      alert('Application status updated.');
      fetchRecruiterData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
          Manage <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Applications</span>
        </h2>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-8">
          <label htmlFor="jobFilter" className="block text-lg font-semibold text-gray-700 mb-3">Filter by Job:</label>
          <select
            id="jobFilter"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            value={selectedJob}
            onChange={(e) => {
              setSelectedJob(e.target.value);
              setCurrentPage(1); // Reset pagination on job filter change
            }}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 text-lg">No applications for this selection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Job: {app.job?.title}</h3>
                <p className="text-gray-700 text-base mb-1">Applicant: <span className="font-medium text-gray-900">{app.student?.name}</span></p>
                <p className="text-gray-700 text-base mb-1">Email: <span className="font-medium text-gray-900">{app.student?.email}</span></p>
                {app.student?.branch && <p className="text-gray-700 text-base mb-1">Branch: <span className="font-medium text-gray-900">{app.student.branch}</span></p>}
                {app.student?.cgpa && <p className="text-gray-700 text-base mb-1">CGPA: <span className="font-medium text-gray-900">{app.student.cgpa}</span></p>}
                {app.student?.resume_link && (
                  <p className="text-blue-600 hover:text-blue-700 transition-colors font-medium mb-3 mt-2 inline-flex items-center">
                    <a href={app.student.resume_link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      📄 View Resume
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                )}
                <p className={`text-lg font-bold ${app.status === 'Placed' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'} mb-3`}>
                  Status: {app.status}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label htmlFor={`status-${app._id}`} className="block text-sm font-semibold text-gray-700 mb-2">Update Status:</label>
                  <select
                    id={`status-${app._id}`}
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Placed">Placed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

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

export default ManageApplications;
