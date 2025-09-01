import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Your Gateway to Campus Placements
        </h1>
        <p className="text-xl text-gray-700 mb-10">
          Connecting students with top companies for their dream careers. Empowering colleges to streamline their placement processes.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Join Us
          </Link>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
            <p className="text-gray-600">Explore diverse job opportunities, apply seamlessly, and track your application status. Get career guidance from seniors.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Recruiters</h3>
            <p className="text-gray-600">Discover top talent, post job openings, manage applications, and streamline your hiring process efficiently.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Admins</h3>
            <p className="text-gray-600">Oversee the entire placement system, manage users, jobs, and feedback with powerful administrative tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
