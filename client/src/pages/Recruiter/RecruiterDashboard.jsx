import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyJobs, deleteJob } from "../../api/jobApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  const fetchMyJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyJobs(currentPage, 10);
      setMyJobs(data?.jobs || []);
      setPages(data?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, setMyJobs, setPages, setLoading, setError]);

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/login");
      return;
    }
    fetchMyJobs();
  }, [user, navigate, currentPage, fetchMyJobs]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
        alert("Job deleted successfully!");
        fetchMyJobs(); // Refresh jobs after deletion
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Posted Jobs</h1>
      <button
        onClick={() => navigate("/recruiter/jobs/create")}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 block mx-auto"
      >
        Create New Job
      </button>

      {myJobs.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No jobs created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-gray-700 mb-4">{job.description}</p>
              <p className="text-gray-600 text-sm mb-1">Location: {job.location}</p>
              <p className="text-gray-600 text-sm mb-1">Salary: {job.salary}</p>
              <p className="text-gray-600 text-sm mb-4">CGPA Criteria: {job.criteria_cgpa}+</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-200"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/recruiter/jobs/edit/${job._id}`)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition duration-200"
                >
                  Edit Job
                </button>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition duration-200"
                >
                  Delete Job
                </button>
                <button
                  onClick={() => navigate(`/recruiter/applications?jobId=${job._id}`)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition duration-200"
                >
                  Manage Applications
                </button>
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
}

export default RecruiterDashboard;
