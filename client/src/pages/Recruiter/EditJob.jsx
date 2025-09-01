import React, { useState, useEffect } from 'react';
import { getJobById, updateJob } from '../../api/jobApi';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';

const EditJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [criteriaBranch, setCriteriaBranch] = useState('');
  const [criteriaCgpa, setCriteriaCgpa] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data } = await getJobById(id);
        setTitle(data.title);
        setDescription(data.description);
        setCriteriaBranch(data.criteria_branch);
        setCriteriaCgpa(data.criteria_cgpa);
        setLocation(data.location);
        setSalary(data.salary);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateJob(id, {
        title,
        description,
        criteria_branch: criteriaBranch,
        criteria_cgpa: criteriaCgpa,
        location,
        salary,
      });
      setSuccess(true);
      navigate('/recruiter/dashboard'); // Navigate back to dashboard after update
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Job</h2>
        {success && <p className="text-green-500 text-center mb-4">Job Updated Successfully!</p>}
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="criteriaBranch" className="block text-sm font-medium text-gray-700">Required Branch</label>
            <input
              type="text"
              id="criteriaBranch"
              placeholder="e.g., CSE, ECE, IT"
              value={criteriaBranch}
              onChange={(e) => setCriteriaBranch(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="criteriaCgpa" className="block text-sm font-medium text-gray-700">Required CGPA</label>
            <input
              type="number"
              id="criteriaCgpa"
              placeholder="e.g., 7.0"
              value={criteriaCgpa}
              onChange={(e) => setCriteriaCgpa(e.target.value)}
              required
              step="0.1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter job location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="text"
              id="salary"
              placeholder="Enter salary (e.g., $50,000 - $70,000)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
