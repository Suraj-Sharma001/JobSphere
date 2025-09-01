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
    <div className="profile-container p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
      {error && <p className="error-message text-red-500 mb-4">{error}</p>}
      {success && <p className="success-message text-green-500 mb-4">Profile Updated Successfully</p>}
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className="form-group mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {user?.role === 'student' && (
          <>
            <div className="form-group mb-4">
              <label htmlFor="branch" className="block text-gray-700 text-sm font-bold mb-2">Branch</label>
              <input
                type="text"
                id="branch"
                placeholder="Enter branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="cgpa" className="block text-gray-700 text-sm font-bold mb-2">CGPA</label>
              <input
                type="number"
                id="cgpa"
                placeholder="Enter CGPA"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="resumeLink" className="block text-gray-700 text-sm font-bold mb-2">Resume Link</label>
              <input
                type="text"
                id="resumeLink"
                placeholder="Enter Resume Link"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}

        {user?.role === 'recruiter' && (
          <div className="form-group mb-4">
            <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <div className="form-group mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          Update
        </button>
      </form>
    </div>
  );
};

export default Profile;
