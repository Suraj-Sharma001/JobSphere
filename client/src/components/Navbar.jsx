import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dashboard links by role
  const dashboardLinks = {
    admin: [
      { to: '/admin/dashboard', label: 'Admin Dashboard' },
      { to: '/community', label: 'Community' },
    ],
    recruiter: [
      { to: '/recruiter/dashboard', label: 'Company Dashboard' },
      { to: '/recruiter/jobs/create', label: 'Post New Job' },
      { to: '/recruiter/applications', label: 'Manage Applications' },
      { to: '/community', label: 'Community' },
    ],
    student: [
      { to: '/student/dashboard', label: 'Dashboard' },
      { to: '/student/applications', label: 'Job Applications' },
      { to: '/profile', label: 'Profile & Resume' },
      { to: '/community', label: 'Community' },
      { to: '/student/feedback', label: 'Submit Feedback' },
    ],
  };

  // Get links for current user role
  const links = user && user.role ? dashboardLinks[user.role] || [] : [];

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white font-bold text-xl tracking-wide hover:text-yellow-300 transition-colors duration-200">JobSphere</Link>
          {links.map(link => (
            <Link key={link.to} to={link.to} className="text-white font-medium hover:text-yellow-300 transition-colors duration-200">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2 relative group">
              <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center text-indigo-700 font-bold text-lg cursor-pointer border-2 border-white shadow">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <span className="text-white font-medium hidden md:block">{user.name}</span>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-white font-medium hover:text-yellow-300 transition-colors duration-200">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
