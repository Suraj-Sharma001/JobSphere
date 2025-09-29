// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { getAllUsers, deleteUser } from '../../api/adminApi';
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Loader from '../../components/Loader';

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pages, setPages] = useState(1);

  
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [deleteSuccess, setDeleteSuccess] = useState(false);

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user || user.role !== 'admin') {
//       navigate('/login');
//       return;
//     }
//     fetchUsers();
//   }, [user, navigate, currentPage, roleFilter, searchQuery, deleteSuccess, fetchUsers]);

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await getAllUsers({ page: currentPage, limit: 10, role: roleFilter === 'all' ? null : roleFilter, query: searchQuery });
//       setUsers(data.users);
//       setPages(data.pages);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, roleFilter, searchQuery]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setLoading(true);
//       setError(null);
//       try {
//         await deleteUser(id);
//         setDeleteSuccess(prev => !prev); // Toggle to trigger re-fetch
//         const notification = document.createElement('div');
//         notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
//         notification.textContent = '🗑️ User deleted successfully!';
//         document.body.appendChild(notification);
//         setTimeout(() => notification.remove(), 3000);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to delete user');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
//           Manage <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Users</span>
//         </h2>

//         {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

//         <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
//             <div className="w-full md:w-1/3">
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//               />
//             </div>
//             <div className="w-full md:w-auto flex items-center space-x-4">
//               <label htmlFor="roleFilter" className="text-gray-700 font-semibold">Filter by Role:</label>
//               <select
//                 id="roleFilter"
//                 value={roleFilter}
//                 onChange={(e) => { setCurrentPage(1); setRoleFilter(e.target.value); }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
//               >
//                 <option value="all">All</option>
//                 <option value="student">Student</option>
//                 <option value="recruiter">Recruiter</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//           </div>

//           {users.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">🤷‍♀️</div>
//               <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Users Found</h3>
//               <p className="text-gray-600 text-lg">Try adjusting your filters or search query.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-xl overflow-hidden">
//                 <thead className="bg-blue-50 border-b border-blue-100">
//                   <tr>
//                     <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Name</th>
//                     <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Email</th>
//                     <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Role</th>
//                     <th className="text-right py-3 px-6 text-gray-700 font-bold text-sm uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((userItem) => ( // Renamed user to userItem to avoid conflict with useContext(AuthContext).user
//                     <tr key={userItem._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
//                       <td className="py-4 px-6 text-gray-800 font-medium">{userItem.name}</td>
//                       <td className="py-4 px-6 text-gray-600">{userItem.email}</td>
//                       <td className="py-4 px-6">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : userItem.role === 'recruiter' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
//                           {userItem.role}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 text-right">
//                         <button
//                           onClick={() => handleDelete(userItem._id)}
//                           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 shadow-md"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {pages > 1 && (
//           <div className="flex justify-center mt-8">
//             <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
//               {[...Array(pages).keys()].map((x) => (
//                 <button
//                   key={x + 1}
//                   onClick={() => setCurrentPage(x + 1)}
//                   className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
//                     x + 1 === currentPage
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "text-blue-700 hover:bg-white hover:shadow-sm"
//                   }`}
//                 >
//                   {x + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageUsers;



import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import { getAllUsers, deleteUser } from '../../api/adminApi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

/*
|--------------------------------------------------------------------------
| ManageUsers Component
|--------------------------------------------------------------------------
| This component is used by Admins to manage application users.
| Features include:
|   - Viewing paginated users list
|   - Searching by name or email
|   - Filtering by role (Admin / Recruiter / Student)
|   - Deleting users with confirmation and notifications
|--------------------------------------------------------------------------
*/

const ManageUsers = () => {

  // ======================================================
  // State Variables
  // ======================================================
  const [users, setUsers] = useState([]);              // Stores fetched users
  const [loading, setLoading] = useState(true);        // Loading state
  const [error, setError] = useState(null);            // Error state
  const [currentPage, setCurrentPage] = useState(1);   // Pagination current page
  const [pages, setPages] = useState(1);               // Total pages
  const [roleFilter, setRoleFilter] = useState('all'); // Role filter
  const [searchQuery, setSearchQuery] = useState('');  // Search query
  const [deleteSuccess, setDeleteSuccess] = useState(false); // Toggle to trigger re-fetch

  // ======================================================
  // Context and Navigation
  // ======================================================
  const { user } = useContext(AuthContext); // Current logged-in user
  const navigate = useNavigate();           // React Router navigation

  // ======================================================
  // Fetch Users (Callback to prevent re-creation on rerenders)
  // ======================================================
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getAllUsers({
        page  : currentPage,
        limit : 10,
        role  : roleFilter === 'all' ? null : roleFilter,
        query : searchQuery,
      });

      setUsers(data.users);
      setPages(data.pages);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, searchQuery]);

  // ======================================================
  // useEffect → Check Authentication + Fetch Data
  // ======================================================
  useEffect(() => {
    // If no user or not an admin → redirect to login
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Fetch users whenever dependencies change
    fetchUsers();

  }, [
    user,
    navigate,
    currentPage,
    roleFilter,
    searchQuery,
    deleteSuccess,
    fetchUsers,
  ]);

  // ======================================================
  // Delete User Handler
  // ======================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');

    if (confirmed) {
      setLoading(true);
      setError(null);

      try {
        await deleteUser(id);

        // Trigger re-fetch by toggling deleteSuccess
        setDeleteSuccess(prev => !prev);

        // Show success notification
        const notification = document.createElement('div');
        notification.className =
          'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = '🗑️ User deleted successfully!';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  // ======================================================
  // Conditional Rendering: Loader or Error
  // ======================================================
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-4">
        {error}
      </p>
    );
  }

  // ======================================================
  // Main JSX Output
  // ======================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight text-center">
          Manage{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Users
          </span>
        </h2>

        {/* Error Banner (if error still exists) */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </p>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-8">

          {/* Search + Role Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">

            {/* Search Input */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>

            {/* Role Filter */}
            <div className="w-full md:w-auto flex items-center space-x-4">
              <label
                htmlFor="roleFilter"
                className="text-gray-700 font-semibold"
              >
                Filter by Role:
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setRoleFilter(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              >
                <option value="all">All</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {users.length === 0 ? (
            // No Users Case
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤷‍♀️</div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600 text-lg">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            // Users List Table
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Name</th>
                    <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Email</th>
                    <th className="text-left py-3 px-6 text-gray-700 font-bold text-sm uppercase">Role</th>
                    <th className="text-right py-3 px-6 text-gray-700 font-bold text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 text-gray-800 font-medium">
                        {userItem.name}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-gray-600">
                        {userItem.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            userItem.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : userItem.role === 'recruiter'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>

                      {/* Delete Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(userItem._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                    x + 1 === currentPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

