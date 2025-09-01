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
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Applications</h2>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <label htmlFor="jobFilter" className="block text-lg font-medium text-gray-700 mb-2">Filter by Job:</label>
        <select
          id="jobFilter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        <p className="text-center text-gray-600 text-lg">No applications found for this selection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job: {app.job?.title}</h3>
              <p className="text-gray-700 mb-1">Applicant: {app.student?.name}</p>
              <p className="text-gray-700 mb-1">Email: {app.student?.email}</p>
              {app.student?.branch && <p className="text-gray-700 mb-1">Branch: {app.student.branch}</p>}
              {app.student?.cgpa && <p className="text-gray-700 mb-1">CGPA: {app.student.cgpa}</p>}
              {app.student?.resume_link && (
                <p className="text-blue-600 hover:underline mb-2">
                  <a href={app.student.resume_link} target="_blank" rel="noopener noreferrer">View Resume</a>
                </p>
              )}
              <p className={`text-lg font-medium ${app.status === 'Placed' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'} mb-3`}>
                Status: {app.status}
              </p>
              <div className="mt-3">
                <label htmlFor={`status-${app._id}`} className="block text-sm font-medium text-gray-700 mb-1">Update Status:</label>
                <select
                  id={`status-${app._id}`}
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setCurrentPage(x + 1)}
              className={`px-4 py-2 rounded-md ${x + 1 === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              {x + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
