import React, { useState } from 'react';
import { createJob } from '../../api/jobApi';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const CreateJob = () => {
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createJob({
        title,
        description,
        criteria_branch: criteriaBranch,
        criteria_cgpa: criteriaCgpa,
        location,
        salary,
      });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setCriteriaBranch('');
      setCriteriaCgpa('');
      setLocation('');
      setSalary('');
      navigate('/recruiter/dashboard');
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
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center font-medium">Job Created Successfully! 🎉</p>}
        {loading && <Loader />}
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            ></textarea>
          </div>
          <div>
            <label htmlFor="criteriaBranch" className="block text-sm font-semibold text-gray-700 mb-2">Required Branch</label>
            <input
              type="text"
              id="criteriaBranch"
              placeholder="e.g., CSE, ECE, IT"
              value={criteriaBranch}
              onChange={(e) => setCriteriaBranch(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="criteriaCgpa" className="block text-sm font-semibold text-gray-700 mb-2">Required CGPA</label>
            <input
              type="number"
              id="criteriaCgpa"
              placeholder="e.g., 7.0"
              value={criteriaCgpa}
              onChange={(e) => setCriteriaCgpa(e.target.value)}
              required
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter job location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
            <input
              type="text"
              id="salary"
              placeholder="Enter salary (e.g., $50,000 - $70,000)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
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


















// import React, { useState } from 'react';
// import { createJob } from '../../api/jobApi';
// import { useNavigate } from 'react-router-dom';
// import Loader from '../../components/Loader';

// const CreateJob = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [criteriaBranch, setCriteriaBranch] = useState('');
//   const [criteriaCgpa, setCriteriaCgpa] = useState('');
//   const [location, setLocation] = useState('');
//   const [salary, setSalary] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
    
//     e.preventDefault();
    
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
    
//     try {
//       await createJob({
//         title,
//         description,
//         criteria_branch: criteriaBranch,
//         criteria_cgpa: criteriaCgpa,
//         location,
//         salary,
//       });
      
//       setSuccess(true);
      
//       setTitle('');
      
//       setDescription('');
//       setCriteriaBranch('');
//       setCriteriaCgpa('');
//       setLocation('');
//       setSalary('');
//       navigate('/recruiter/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create job');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
//       <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8 md:p-10">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
//           Post a New <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job</span>
//         </h2>
//         {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}
//         {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center font-medium">Job Created Successfully! 🎉</p>}
//         {loading && <Loader />}
//         <form onSubmit={submitHandler} className="space-y-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
//             <input
//               type="text"
//               id="title"
//               placeholder="Enter job title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea
//               id="description"
//               placeholder="Enter job description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//               rows="4"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             ></textarea>
//           </div>
//           <div>
//             <label htmlFor="criteriaBranch" className="block text-sm font-semibold text-gray-700 mb-2">Required Branch</label>
//             <input
//               type="text"
//               id="criteriaBranch"
//               placeholder="e.g., CSE, ECE, IT"
//               value={criteriaBranch}
//               onChange={(e) => setCriteriaBranch(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             />
//           </div>
//           <div>
//             <label htmlFor="criteriaCgpa" className="block text-sm font-semibold text-gray-700 mb-2">Required CGPA</label>
//             <input
//               type="number"
//               id="criteriaCgpa"
//               placeholder="e.g., 7.0"
//               value={criteriaCgpa}
//               onChange={(e) => setCriteriaCgpa(e.target.value)}
//               required
//               step="0.1"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             />
//           </div>
//           <div>
//             <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
//             <input
//               type="text"
//               id="location"
//               placeholder="Enter job location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             />
//           </div>
//           <div>
//             <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
//             <input
//               type="text"
//               id="salary"
//               placeholder="Enter salary (e.g., $50,000 - $70,000)"
//               value={salary}
//               onChange={(e) => setSalary(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Posting Job...
//               </span>
//             ) : (
//               <>Post Job</>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateJob;

