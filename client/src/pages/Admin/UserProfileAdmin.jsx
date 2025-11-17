import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/adminApi';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const UserProfileAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', branch: '', cgpa: '', resume_link: '', company_name: '', role: 'student' });
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUser();
    // eslint-disable-next-line
  }, [id, user]);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserById(id);
      setForm({
        name: data.name || '',
        email: data.email || '',
        branch: data.branch || '',
        cgpa: data.cgpa || '',
        resume_link: data.resume_link || '',
        company_name: data.company_name || '',
        role: data.role || 'student',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return setError('Please provide a reason for the change');
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, reason };
      await updateUser(id, payload);
      alert('User updated successfully');
      navigate('/admin/manage-users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-extrabold mb-4">Edit User Profile (Admin)</h2>
        <p className="text-sm text-gray-600 mb-4">Actions are audited and recorded.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
              <input name="branch" value={form.branch} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CGPA</label>
              <input name="cgpa" value={form.cgpa} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Resume Link</label>
            <input name="resume_link" value={form.resume_link} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for change (logged)</label>
            <input name="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Reason (required)" required />
          </div>

          <div className="flex items-center space-x-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Save changes</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileAdmin;
