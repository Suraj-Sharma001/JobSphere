import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
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

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      {/* Users Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Name</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Email</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Role</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    {editingUser === u._id ? (
                      <>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="text"
                            value={editedUserName}
                            onChange={(e) => setEditedUserName(e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="email"
                            value={editedUserEmail}
                            onChange={(e) => setEditedUserEmail(e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <select
                            value={editedUserRole}
                            onChange={(e) => setEditedUserRole(e.target.value)}
                            className="border rounded p-1 w-full"
                          >
                            <option value="student">Student</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button onClick={() => handleUpdateUser(u._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2">Save</button>
                          <button onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b">{u.name}</td>
                        <td className="py-2 px-4 border-b">{u.email}</td>
                        <td className="py-2 px-4 border-b">{u.role}</td>
                        <td className="py-2 px-4 border-b">
                          <button onClick={() => handleEditUser(u)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2">Edit</button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(usersPages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setUsersPage(x + 1)}
                className={`px-3 py-1 rounded-md ${x + 1 === usersPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Jobs Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Title</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Company</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id}>
                    <td className="py-2 px-4 border-b">{j.title}</td>
                    <td className="py-2 px-4 border-b">{j.company?.company_name}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(jobsPages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setJobsPage(x + 1)}
                className={`px-3 py-1 rounded-md ${x + 1 === jobsPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Feedback</h2>
        {feedback.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Student</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Company</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Feedback</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((f) => (
                  <tr key={f._id}>
                    <td className="py-2 px-4 border-b">{f.student?.name} ({f.student?.email})</td>
                    <td className="py-2 px-4 border-b">{f.company_name}</td>
                    <td className="py-2 px-4 border-b">{f.feedback_text}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDeleteFeedback(f._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(feedbackPages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setFeedbackPage(x + 1)}
                className={`px-3 py-1 rounded-md ${x + 1 === feedbackPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Applications Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Applications</h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Job Title</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Applicant</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a._id}>
                    <td className="py-2 px-4 border-b">{a.job?.title} ({a.job?.company_name})</td>
                    <td className="py-2 px-4 border-b">{a.student?.name} ({a.student?.email})</td>
                    <td className="py-2 px-4 border-b">{a.status}</td>
                    <td className="py-2 px-4 border-b">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {applicationsPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(applicationsPages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setApplicationsPage(x + 1)}
                className={`px-3 py-1 rounded-md ${x + 1 === applicationsPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
