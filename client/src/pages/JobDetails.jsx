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
      alert('Only students can apply for jobs.');
      return;
    }

    try {
      await applyJob(id);
      setApplySuccess(true);
      alert('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!job) return <p className="text-center mt-4">Job not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h2>
        <p className="text-gray-600 text-lg mb-6">Posted by: {job.company?.company_name || 'N/A'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="text-gray-700 text-base flex items-center"><span className="mr-2 text-xl">📍</span><strong>Location:</strong> {job.location}</p>
          <p className="text-gray-700 text-base flex items-center"><span className="mr-2 text-xl">💰</span><strong>Salary:</strong> {job.salary}</p>
          <p className="text-gray-700 text-base flex items-center"><span className="mr-2 text-xl">🎓</span><strong>Required CGPA:</strong> {job.criteria_cgpa}+</p>
          <p className="text-gray-700 text-base flex items-center"><span className="mr-2 text-xl">📜</span><strong>Required Branch:</strong> {job.criteria_branch}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {user && user.role === 'student' && !applySuccess && (
          <button
            onClick={handleApply}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Now
          </button>
        )}
        {applySuccess && <p className="text-green-600 text-center mt-4 text-lg">You have successfully applied for this job!</p>}
      </div>
    </div>
  );
};

export default JobDetails;
