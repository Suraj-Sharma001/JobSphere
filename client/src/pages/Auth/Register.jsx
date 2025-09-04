import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role if already logged in
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userData = {
        name,
        email,
        password,
        role,
        ...(role === 'student' && { branch, cgpa: parseFloat(cgpa), resume_link: resumeLink }),
        ...(role === 'recruiter' && { company_name: companyName }),
      };

      const { data } = await registerUser(userData);
      dispatch({ type: 'LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      // Redirect based on new user role
      if (data.role === 'student') navigate('/student/dashboard');
      else if (data.role === 'recruiter') navigate('/recruiter/dashboard');
      else if (data.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-blue-100 md:p-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Register</span> Your Account
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}
        {loading && <Loader />}
        <form onSubmit={submitHandler} className="space-y-6 md:space-y-7">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">Register As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === 'student' && (
            <>
              <div>
                <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
                <input
                  type="text"
                  id="branch"
                  placeholder="Enter your branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="cgpa" className="block text-sm font-semibold text-gray-700 mb-2">CGPA</label>
                <input
                  type="number"
                  id="cgpa"
                  placeholder="Enter your CGPA"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="resumeLink" className="block text-sm font-semibold text-gray-700 mb-2">Resume Link</label>
                <input
                  type="text"
                  id="resumeLink"
                  placeholder="Enter link to your resume"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
            </>
          )}

          {role === 'recruiter' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              <>Register</>
            )}
          </button>
        </form>
        <p className="mt-8 text-center text-base text-gray-600">
          Already have an account? 
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 ml-1 transition-colors duration-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
