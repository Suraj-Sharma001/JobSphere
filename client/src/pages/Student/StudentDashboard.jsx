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
      alert("Applied!");
      fetchJobs(); // Refresh jobs after applying
    } catch (err) {
      setError(err.response?.data?.message || "Already applied or error");
    }
  };

  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page on filter change
    fetchJobs();
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back! Track your placement journey</p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Applications Sent</p>
            <p className="text-3xl font-bold text-gray-800">12 <span className="text-green-500 text-base">↑ +3 this week</span></p>
          </div>
          <span className="text-blue-500 text-4xl">🚀</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Shortlisted</p>
            <p className="text-3xl font-bold text-gray-800">4 <span className="text-yellow-500 text-base">★ 33% rate</span></p>
          </div>
          <span className="text-yellow-500 text-4xl">⭐</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Interviews</p>
            <p className="text-3xl font-bold text-gray-800">2 <span className="text-green-500 text-base">🗓️ 1 upcoming</span></p>
          </div>
          <span className="text-green-500 text-4xl">🤝</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Profile Score</p>
            <p className="text-3xl font-bold text-gray-800">85% <span className="text-blue-500 text-base">✅ Complete profile</span></p>
          </div>
          <span className="text-blue-500 text-4xl">👤</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Opportunities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Opportunities</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4 justify-between items-center border border-gray-200">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
            <input
              type="number"
              placeholder="Min CGPA"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Search by Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
            >
              Filter
            </button>
          </div>

          {jobs.length === 0 ? (
            <p className="text-center text-gray-600 text-lg mt-8">No jobs available matching your criteria.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} onApply={handleApply} />
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

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-medium text-gray-900">ConsultPro Services</p>
              <p className="text-gray-600 text-sm">Application deadline: <span className="text-red-500">2 days (Dec 20)</span></p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium text-gray-900">FinanceFlow Ltd</p>
              <p className="text-gray-600 text-sm">Interview prep: <span className="text-yellow-600">1 day (Dec 18)</span></p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium text-gray-900">GlobalTech Innovations</p>
              <p className="text-gray-600 text-sm">Assessment due: <span className="text-green-600">5 days (Dec 23)</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
