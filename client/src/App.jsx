import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Student/StudentDashboard";
import MyApplications from "./pages/Student/MyApplications"; // Import MyApplications component
import SubmitFeedback from "./pages/Feedback/SubmitFeedback";
import CommunityBoard from "./pages/Community/CommunityBoard";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Auth/Profile"; // Import Profile component
import CreateJob from "./pages/Recruiter/CreateJob"; // Import CreateJob component
import EditJob from "./pages/Recruiter/EditJob"; // Import EditJob component
import JobDetails from "./pages/JobDetails"; // Import JobDetails component
import Home from "./pages/Home"; // Import Home component
import ManageApplications from "./pages/Recruiter/ManageApplications"; // Import ManageApplications component
import CompanyFeedbackList from "./pages/Feedback/CompanyFeedbackList"; // Import CompanyFeedbackList
import PostDetails from "./pages/Community/PostDetails"; // Import PostDetails
import About from "./pages/About/About"

function App() {  
  const hideNavAndSidebar = window.location.pathname === "/login" || window.location.pathname === "/register";

  return (
    <AuthProvider>
      <div className="flex">
  {/* Sidebar removed */}
        <div className="flex-1 flex flex-col">
          {!hideNavAndSidebar && <Navbar />}
          <main className="flex-1 p-6 bg-gray-100">
            <Routes>
              <Route path="/" element={<Home />} /> {/* Public Home page */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />

              <Route path="/profile" element={
                <ProtectedRoute roles={["student","recruiter","admin"]}><Profile /></ProtectedRoute>
              } />

              <Route path="/job/:id" element={
                <ProtectedRoute roles={["student","recruiter","admin"]}><JobDetails /></ProtectedRoute>
              } />

              <Route path="/student/dashboard" element={
                <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute roles={["student"]}><Profile /></ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute roles={["student","recruiter","admin"]}><SubmitFeedback /></ProtectedRoute>
              } />
              <Route path="/student/applications" element={
                <ProtectedRoute roles={["student"]}><MyApplications /></ProtectedRoute>
              } />
              <Route path="/student/feedback" element={
                <ProtectedRoute roles={["student"]}><SubmitFeedback /></ProtectedRoute>
              } />
              <Route path="/student/company-feedback" element={
                <ProtectedRoute roles={["student"]}><CompanyFeedbackList /></ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute roles={["student","recruiter","admin"]}><CommunityBoard /></ProtectedRoute>
              } />
              <Route path="/community/:id" element={
                <ProtectedRoute roles={["student","recruiter","admin"]}><PostDetails /></ProtectedRoute>
              } />

import PostJob from "./pages/Recruiter/PostJob"; // Import PostJob component
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute roles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>
              } />
              <Route path="/recruiter/job-applications" element={
                <ProtectedRoute roles={["recruiter"]}><MyApplications /></ProtectedRoute>
              } />
              <Route path="/recruiter/edit-job" element={
                <ProtectedRoute roles={["recruiter"]}><EditJob /></ProtectedRoute>
              } />
              <Route path="/recruiter/jobs/create" element={
                <ProtectedRoute roles={["recruiter"]}><CreateJob /></ProtectedRoute>
              } />
              <Route path="/recruiter/jobs/edit/:id" element={
                <ProtectedRoute roles={["recruiter"]}><EditJob /></ProtectedRoute>
              } />
              <Route path="/recruiter/applications" element={
                <ProtectedRoute roles={["recruiter"]}><ManageApplications /></ProtectedRoute>
              } />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/manage-users" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard section="users" /></ProtectedRoute>
              } />
              <Route path="/admin/manage-jobs" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard section="jobs" /></ProtectedRoute>
              } />
              <Route path="/admin/manage-applications" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard section="applications" /></ProtectedRoute>
              } />
              <Route path="/admin/view-feedback" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard section="feedback" /></ProtectedRoute>
              } />
              
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
