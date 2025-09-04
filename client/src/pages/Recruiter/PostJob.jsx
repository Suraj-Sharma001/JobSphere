import React, { useState, useContext, useEffect } from 'react';
import { createJob } from '../../api/jobApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [criteriaCgpa, setCriteriaCgpa] = useState('');
  const [criteriaBranch, setCriteriaBranch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const jobData = {
        title,
        description,
        requirements,
        benefits,
        location,
        salary,
        criteria_cgpa: parseFloat(criteriaCgpa),
        criteria_branch: criteriaBranch,
      };
      await createJob(jobData);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setRequirements('');
      setBenefits('');
      setLocation('');
      setSalary('');
      setCriteriaCgpa('');
      setCriteriaBranch('');
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = '🎉 Job created successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
          Post a New <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job</span>
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center font-medium">Job Posted Successfully! 🎉</p>}
        {loading && <Loader />}
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Job Title</label>
              <input
                type="text"
                id="title"
                placeholder="e.g., Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
              <input
                type="text"
                id="location"
                placeholder="e.g., Bangalore, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="salary" className="block text-gray-700 text-sm font-semibold mb-2">Salary (LPA)</label>
              <input
                type="text"
                id="salary"
                placeholder="e.g., 8-12 LPA or 1500000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="criteriaCgpa" className="block text-gray-700 text-sm font-semibold mb-2">Min CGPA</label>
              <input
                type="number"
                id="criteriaCgpa"
                placeholder="e.g., 7.5"
                value={criteriaCgpa}
                onChange={(e) => setCriteriaCgpa(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                step="0.1"
                min="0"
                max="10"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="criteriaBranch" className="block text-gray-700 text-sm font-semibold mb-2">Eligible Branches</label>
              <input
                type="text"
                id="criteriaBranch"
                placeholder="e.g., CSE, ECE, IT (comma separated)"
                value={criteriaBranch}
                onChange={(e) => setCriteriaBranch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Job Description</label>
            <textarea
              id="description"
              placeholder="Provide a detailed description of the job role..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-gray-700 text-sm font-semibold mb-2">Requirements</label>
            <textarea
              id="requirements"
              placeholder="List key requirements for the role..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            ></textarea>
          </div>
          <div>
            <label htmlFor="benefits" className="block text-gray-700 text-sm font-semibold mb-2">Benefits (Optional)</label>
            <textarea
              id="benefits"
              placeholder="List any benefits offered with the role..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            ></textarea>
          </div>

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
                Posting Job...
              </span>
            ) : (
              <>Post Job</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
