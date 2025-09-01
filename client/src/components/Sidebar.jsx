import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 shadow-lg">
      <div className="text-2xl font-bold mb-6 flex items-center">
        <img src="/vite.svg" alt="PlacePortal Logo" className="h-8 w-8 mr-2" />
        <Link to="/" className="text-white">PlacePortal</Link>
      </div>

      <nav className="space-y-2 mb-8">
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Main Menu</h3>
        <NavLink to="/" icon="📊">Dashboard</NavLink>
        {user?.role === 'student' && (
          <>
            <NavLink to="/student/applications" icon="💼">Job Applications</NavLink>
            <NavLink to="/profile" icon="📝">Profile & Resume</NavLink>
            <NavLink to="/community" icon="👥">Community</NavLink>
            <NavLink to="/student/feedback" icon="💬">Submit Feedback</NavLink>
            <NavLink to="/student/company-feedback" icon="🏢">Feedback & Reviews</NavLink>
          </>
        )}
        {user?.role === 'recruiter' && (
          <>
            <NavLink to="/recruiter/dashboard" icon="🏢">Company Dashboard</NavLink>
            <NavLink to="/recruiter/jobs/create" icon="📝">Post New Job</NavLink>
            <NavLink to="/recruiter/applications" icon="🧑‍💻">Manage Applications</NavLink>
            <NavLink to="/community" icon="👥">Community</NavLink>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin/dashboard" icon="⚙️">Admin Dashboard</NavLink>
            <NavLink to="/community" icon="👥">Community</NavLink>
          </>
        )}
      </nav>

      {user && (
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2 text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200 absolute bottom-4 left-4 right-4"
        >
          <span className="mr-3 text-lg">➡️</span>
          Logout
        </button>
      )}
    </div>
  );
}

const NavLink = ({ to, icon, children }) => {
  return (
    <Link
      to={to}
      className="flex items-center p-2 text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
    >
      <span className="mr-3 text-lg">{icon}</span>
      {children}
    </Link>
  );
};

export default Sidebar;
