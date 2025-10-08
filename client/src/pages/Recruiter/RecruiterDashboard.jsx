import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyJobs, deleteJob } from "../../api/jobApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function RecruiterDashboard() {
  // ===== Context & Navigation =====
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ===== State Management =====
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ===== Fetch Jobs Function =====
  const fetchMyJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getMyJobs(currentPage, 10);
      setMyJobs(data?.jobs || []);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // ===== Effect: Auth Check & Fetch Jobs =====
  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/login");
      return;
    }

    fetchMyJobs();
  }, [user, navigate, currentPage, fetchMyJobs]);

  // ===== Delete Job Handler =====
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteJob(jobId);
      alert("Job deleted successfully!");
      fetchMyJobs(); // Refresh jobs after deletion
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
    }
  };

  // ===== Loading & Error States =====
  if (loading) return <Loader />;

  if (error)
    return (
      <p className="error-message text-red-500 text-center mt-4 font-medium">
        {error}
      </p>
    );

  // ===== Main Render =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ===== Page Header ===== */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
          My Posted{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Jobs
          </span>
        </h1>

        {/* ===== Create New Job Button ===== */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="
              group 
              inline-flex 
              items-center 
              justify-center 
              px-8 py-3 
              border border-transparent 
              text-base font-semibold 
              rounded-xl 
              text-white 
              bg-gradient-to-r from-green-500 to-teal-600 
              hover:from-green-600 hover:to-teal-700 
              shadow-lg hover:shadow-xl 
              transition-all duration-300 
              transform hover:scale-105
            "
          >
            <span className="mr-2">✨</span>
            Create New Job
          </button>
        </div>

        {/* ===== No Jobs Empty State ===== */}
        {myJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="text-6xl mb-4">🤷‍♀️</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              No Jobs Posted Yet
            </h3>
            <p className="text-gray-600 text-lg">
              You haven't posted any jobs yet. Click "Create New Job" above to start!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* ===== Job Cards ===== */}
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="
                  bg-white 
                  p-6 
                  rounded-2xl 
                  shadow-xl 
                  border border-blue-100 
                  hover:shadow-2xl 
                  transition-all duration-300 
                  transform hover:-translate-y-1
                "
              >
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-700 text-base mb-4 line-clamp-3">
                  {job.description}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {job.location}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-semibold text-gray-800">Salary:</span>{" "}
                  {job.salary}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-semibold text-gray-800">CGPA Criteria:</span>{" "}
                  {job.criteria_cgpa}+
                </p>

                {/* ===== Action Buttons ===== */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium shadow-md"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/recruiter/jobs/edit/${job._id}`)}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors duration-200 font-medium shadow-md"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 font-medium shadow-md"
                  >
                    Delete Job
                  </button>
                  <button
                    onClick={() => navigate(`/recruiter/applications?jobId=${job._id}`)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200 font-medium shadow-md"
                  >
                    Manage Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
              {[...Array(totalPages).keys()].map((pageIndex) => (
                <button
                  key={pageIndex + 1}
                  onClick={() => setCurrentPage(pageIndex + 1)}
                  className={`
                    px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200
                    ${
                      pageIndex + 1 === currentPage
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-blue-700 hover:bg-white hover:shadow-sm"
                    }
                  `}
                >
                  {pageIndex + 1}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RecruiterDashboard;






















// previous code of RecuriterDashboard.jsx
// import { useEffect, useState, useContext, useCallback } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { getMyJobs, deleteJob } from "../../api/jobApi";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../components/Loader";

// function RecruiterDashboard() {
//   const { user } = useContext(AuthContext);
//   const [myJobs, setMyJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const navigate = useNavigate();

//   const fetchMyJobs = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await getMyJobs(currentPage, 10);
//       setMyJobs(data?.jobs || []);
//       setPages(data?.pages || 1);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, setMyJobs, setPages, setLoading, setError]);

//   useEffect(() => {
//     if (!user || user.role !== "recruiter") {
//       navigate("/login");
//       return;
//     }
//     fetchMyJobs();
//   }, [user, navigate, currentPage, fetchMyJobs]);

//   const handleDeleteJob = async (jobId) => {
//     if (window.confirm("Are you sure you want to delete this job?")) {
//       try {
//         await deleteJob(jobId);
//         alert("Job deleted successfully!");
//         fetchMyJobs(); // Refresh jobs after deletion
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to delete job");
//       }
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
//           My Posted <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Jobs</span>
//         </h1>
//         {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}
//         <button
//           onClick={() => navigate("/recruiter/jobs/create")}
//           className="group inline-flex items-center justify-center mb-8 px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mx-auto"
//         >
//           <span className="mr-2">✨</span>
//           Create New Job
//         </button>

//         {myJobs.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
//             <div className="text-6xl mb-4">🤷‍♀️</div>
//             <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Jobs Posted Yet</h3>
//             <p className="text-gray-600 text-lg">Start by creating your first job posting!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {myJobs.map((job) => (
//               <div key={job._id} className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//                 <h2 className="text-xl font-extrabold text-gray-900 mb-2">{job.title}</h2>
//                 <p className="text-gray-700 text-base mb-4 line-clamp-3">{job.description}</p>
//                 <p className="text-gray-600 text-sm mb-1"><span className="font-semibold text-gray-800">Location:</span> {job.location}</p>
//                 <p className="text-gray-600 text-sm mb-1"><span className="font-semibold text-gray-800">Salary:</span> {job.salary}</p>
//                 <p className="text-gray-600 text-sm mb-4"><span className="font-semibold text-gray-800">CGPA Criteria:</span> {job.criteria_cgpa}+</p>
//                 <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
//                   <button
//                     onClick={() => navigate(`/job/${job._id}`)}
//                     className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium shadow-md"
//                   >
//                     View Details
//                   </button>
//                   <button
//                     onClick={() => navigate(`/recruiter/jobs/edit/${job._id}`)}
//                     className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors duration-200 font-medium shadow-md"
//                   >
//                     Edit Job
//                   </button>
//                   <button
//                     onClick={() => handleDeleteJob(job._id)}
//                     className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 font-medium shadow-md"
//                   >
//                     Delete Job
//                   </button>
//                   <button
//                     onClick={() => navigate(`/recruiter/applications?jobId=${job._id}`)}
//                     className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200 font-medium shadow-md"
//                   >
//                     Manage Applications
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {pages > 1 && (
//           <div className="flex justify-center mt-10">
//             <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
//               {[...Array(pages).keys()].map((x) => (
//                 <button
//                   key={x + 1}
//                   onClick={() => setCurrentPage(x + 1)}
//                   className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
//                     x + 1 === currentPage
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "text-blue-700 hover:bg-white hover:shadow-sm"
//                   }`}
//                 >
//                   {x + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RecruiterDashboard;
