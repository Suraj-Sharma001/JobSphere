import React, { useState, useEffect, useContext } from 'react';
import { getUserProfile, updateUserProfile } from '../../api/authApi'; // Corrected API import
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data } = await getUserProfile();
      setName(data.name);
      setEmail(data.email);
      setBranch(data.branch || '');
      setCgpa(data.cgpa || '');
      setResumeLink(data.resume_link || '');
      setCompanyName(data.company_name || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedData = {
        name,
        email,
        password,
        branch: user.role === 'student' ? branch : undefined,
        cgpa: user.role === 'student' ? cgpa : undefined,
        resume_link: user.role === 'student' ? resumeLink : undefined,
        company_name: user.role === 'recruiter' ? companyName : undefined,
      };
      const { data } = await updateUserProfile(updatedData);
      dispatch({ type: 'LOGIN', payload: data }); // Update user info in context
      localStorage.setItem('userInfo', JSON.stringify(data));
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
          Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile</span>
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-medium">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center font-medium">Profile Updated Successfully 🎉</p>}
        {loading && <Loader />}
        <form onSubmit={submitHandler}>
          <div className="form-group mb-5">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div className="form-group mb-5">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>

          {user?.role === 'student' && (
            <>
              <div className="form-group mb-5">
                <label htmlFor="branch" className="block text-gray-700 text-sm font-semibold mb-2">Branch</label>
                <input
                  type="text"
                  id="branch"
                  placeholder="Enter your branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="cgpa" className="block text-gray-700 text-sm font-semibold mb-2">CGPA</label>
                <input
                  type="number"
                  id="cgpa"
                  placeholder="Enter your CGPA"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>
              <div className="form-group mb-5">
                <label htmlFor="resumeLink" className="block text-gray-700 text-sm font-semibold mb-2">Resume Link</label>
                <input
                  type="text"
                  id="resumeLink"
                  placeholder="Enter your Resume Link"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
            </>
          )}

          {user?.role === 'recruiter' && (
            <div className="form-group mb-5">
              <label htmlFor="companyName" className="block text-gray-700 text-sm font-semibold mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>
          )}

          <div className="form-group mb-5">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div className="form-group mb-8">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <button 
            type="submit" 
            className="w-full group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              <>Update Profile</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
