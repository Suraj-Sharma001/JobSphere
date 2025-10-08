import {
  useEffect,
  useState, 
  useContext,
  useCallback 
} from "react";

import {
  AuthContext
} from "../../context/AuthContext";

import {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllFeedback,
  deleteFeedback,
  getAllApplications,
  updateUser,
} from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function AdminDashboard() {

  // Context + Navigation
  
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [usersPages, setUsersPages] = useState(1);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsPages, setJobsPages] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackPages, setFeedbackPages] = useState(1);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [applicationsPages, setApplicationsPages] = useState(1);

  // Edit user state
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedUserEmail, setEditedUserEmail] = useState("");
  const [editedUserRole, setEditedUserRole] = useState("");

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: usersData } = await getAllUsers(usersPage, 10);
      setUsers(usersData.users);
      setUsersPages(usersData.pages);

      const { data: jobsData } = await getAllJobs(jobsPage, 10);
      setJobs(jobsData.jobs);
      setJobsPages(jobsData.pages);

      const { data: feedbackData } = await getAllFeedback(feedbackPage, 10);
      setFeedback(feedbackData?.feedbackList || []);
      setFeedbackPages(feedbackData?.pages || 1);

      const { data: applicationsData } = await getAllApplications(applicationsPage, 10);
      setApplications(applicationsData?.applications || []);
      setApplicationsPages(applicationsData?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  }, [
    usersPage,
    jobsPage,
    feedbackPage,
    applicationsPage,
    setUsers,
    setUsersPages,
    setJobs,
    setJobsPages,
    setFeedback,
    setFeedbackPages,
    setApplications,
    setApplicationsPages,
    setLoading,
    setError,
  ]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      setError("Unauthorized access");
      setLoading(false);
      return;
    }
    fetchAdminData();
  }, [user, navigate, usersPage, jobsPage, feedbackPage, applicationsPage, fetchAdminData]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        alert("User deleted successfully!");
        fetchAdminData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit._id);
    setEditedUserName(userToEdit.name);
    setEditedUserEmail(userToEdit.email);
    setEditedUserRole(userToEdit.role);
  };

  const handleUpdateUser = async (id) => {
    try {
      await updateUser(id, {
        name: editedUserName,
        email: editedUserEmail,
        role: editedUserRole,
      });
      alert("User updated successfully!");
      setEditingUser(null);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id);
        alert("Job deleted successfully!");
        fetchAdminData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(id);
        alert("Feedback deleted successfully!");
        fetchAdminData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete feedback");
      }
    }
  };

  // Render

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 leading-tight text-center">
          Admin <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        {/* Users Section */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Manage Users</h2>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🤷‍♀️</div>
              <p className="text-gray-600 text-lg">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-bold text-sm uppercase">Name</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Email</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Role</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      {editingUser === u._id ? (
                        <>
                          <td className="py-3 px-4 border-b">
                            <input
                              type="text"
                              value={editedUserName}
                              onChange={(e) => setEditedUserName(e.target.value)}
                              className="border border-gray-300 rounded-md p-2 w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4 border-b">
                            <input
                              type="email"
                              value={editedUserEmail}
                              onChange={(e) => setEditedUserEmail(e.target.value)}
                              className="border border-gray-300 rounded-md p-2 w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4 border-b">
                            <select
                              value={editedUserRole}
                              onChange={(e) => setEditedUserRole(e.target.value)}
                              className="border border-gray-300 rounded-md p-2 w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="student">Student</option>
                              <option value="recruiter">Recruiter</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 border-b flex space-x-2">
                            <button onClick={() => handleUpdateUser(u._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md">Save</button>
                            <button onClick={() => setEditingUser(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4 border-b text-gray-800 font-medium">{u.name}</td>
                          <td className="py-3 px-4 border-b text-gray-600">{u.email}</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'recruiter' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b flex space-x-2">
                            <button onClick={() => handleEditUser(u)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md">Edit</button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {usersPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
                {[...Array(usersPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setUsersPage(x + 1)}
                    className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      x + 1 === usersPage
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

        {/* Jobs Section */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Manage Jobs</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🤷‍♀️</div>
              <p className="text-gray-600 text-lg">No jobs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-bold text-sm uppercase">Title</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Company</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800 font-medium">{j.title}</td>
                      <td className="py-3 px-4 text-gray-600">{j.company?.company_name}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteJob(j._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {jobsPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
                {[...Array(jobsPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setJobsPage(x + 1)}
                    className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      x + 1 === jobsPage
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

        {/* Feedback Section */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Manage Feedback</h2>
          {feedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🤷‍♀️</div>
              <p className="text-gray-600 text-lg">No feedback found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-bold text-sm uppercase">Student</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Company</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Feedback</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <tr key={f._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800 font-medium">{f.student?.name} ({f.student?.email})</td>
                      <td className="py-3 px-4 text-gray-600">{f.company_name}</td>
                      <td className="py-3 px-4 text-gray-600">{f.feedback_text}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteFeedback(f._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {feedbackPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
                {[...Array(feedbackPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setFeedbackPage(x + 1)}
                    className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      x + 1 === feedbackPage
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

        {/* Applications Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Manage Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🤷‍♀️</div>
              <p className="text-gray-600 text-lg">No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-bold text-sm uppercase">Job Title</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Applicant</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Status</th>
                    <th className="py-3 px-4 border-l border-blue-100 text-left text-gray-700 font-bold text-sm uppercase">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800 font-medium">{a.job?.title} ({a.job?.company_name})</td>
                      <td className="py-3 px-4 text-gray-600">{a.student?.name} ({a.student?.email})</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.status === 'Placed' ? 'bg-green-100 text-green-800' : a.status === 'Rejected' ? 'bg-red-100 text-red-800' : a.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : a.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {applicationsPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
                {[...Array(applicationsPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setApplicationsPage(x + 1)}
                    className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      x + 1 === applicationsPage
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
    </div>
  );
}

export default AdminDashboard;
