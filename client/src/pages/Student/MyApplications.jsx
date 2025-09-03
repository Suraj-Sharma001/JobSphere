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
  }, [currentPage, setApplications, setPages, setLoading, setError]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchMyApplications();
  }, [user, navigate, currentPage, fetchMyApplications]);

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="my-applications-container p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You haven't applied for any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job: {app.job?.title}</h3>
              <p className="text-gray-700 mb-1">Company: {app.job?.company?.company_name}</p>
              <p className="text-gray-700 mb-1">Description: {app.job?.description}</p>
              <p className={`text-lg font-medium ${app.status === 'Placed' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                Status: {app.status}
              </p>
              <p className="text-sm text-gray-500 mt-2">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                onClick={() => navigate('/feedback', { state: { jobId: app.job?._id } })}
              >
                Submit Feedback
              </button>
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

export default MyApplications;
