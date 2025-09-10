import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  // Dashboard links by role
  const dashboardLinks = {
    admin: [
      { to: '/admin/dashboard', label: 'Admin Dashboard', icon: '⚡' },
      { to: '/community', label: 'Community', icon: '👥' },
    ],
    recruiter: [
      { to: '/recruiter/dashboard', label: 'Company Dashboard', icon: '🏢' },
      { to: '/recruiter/jobs/create', label: 'Post New Job', icon: '✏️' },
      { to: '/recruiter/applications', label: 'Manage Applications', icon: '📋' },
      { to: '/community', label: 'Community', icon: '👥' },
    ],
    student: [
      { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/student/applications', label: 'Job Applications', icon: '📝' },
      { to: '/profile', label: 'Profile & Resume', icon: '👤' },
      { to: '/community', label: 'Community', icon: '👥' },
      { to: '/student/feedback', label: 'Submit Feedback', icon: '💬' },
    ],
  };

  // Get links for current user role
  const links = user && user.role ? dashboardLinks[user.role] || [] : [];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/images/logo.jpg" 
                  alt="JobSphere Logo" 
                  className="h-10 w-10 drop-shadow-lg transform group-hover:rotate-12 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className={`font-bold text-2xl tracking-tight transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-800 group-hover:text-blue-600' 
                  : 'text-white group-hover:text-yellow-300'
              }`}>
                JobSphere
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group overflow-hidden ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - User Profile or Login */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 group focus:outline-none"
                >
                  <div className="hidden md:flex flex-col items-end">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}>
                      {user.name}
                    </span>
                    <span className={`text-xs capitalize transition-colors duration-300 ${
                      isScrolled ? 'text-gray-500' : 'text-white/70'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-2 border-white/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                </button>

                {/* Enhanced Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 transform transition-all duration-200 animate-in slide-in-from-top-5">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span>👤</span>
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <span>🚪</span>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200/50">
          <div className="px-4 py-6 space-y-2">
            {links.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;  