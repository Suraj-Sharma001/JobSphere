import { Link } from "react-router-dom";

function JobCard({ job, onApply, isEligible = true }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {/* Placeholder for company logo */}
          <img src="/vite.svg" alt="Company Logo" className="h-10 w-10 rounded-full mr-3 border" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company?.company_name || 'N/A'}</p>
          </div>
        </div>
        {job.applied ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Applied</span>
        ) : (
          <button
            onClick={() => onApply(job._id)}
            disabled={!isEligible}
            title={!isEligible ? 'You do not meet the eligibility criteria for this job' : 'Apply'}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-200 ${!isEligible ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            Apply
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4 flex-grow">{job.description}</p>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <p className="flex items-center"><span className="mr-2 text-lg">📍</span>{job.location}</p>
        <p className="flex items-center"><span className="mr-2 text-lg">💰</span>{job.salary}</p>
        <p className="flex items-center"><span className="mr-2 text-lg">🎓</span>CGPA {job.criteria_cgpa}+</p>
        <p className="flex items-center"><span className="mr-2 text-lg">📜</span>Branch: {job.criteria_branch}</p>
      </div>

      <div className="mt-auto flex justify-between items-center">
        <Link
          to={`/job/${job._id}`}
          className="text-blue-600 hover:underline font-medium text-sm"
        >
          View Details
        </Link>
        {job.applied && <span className="text-gray-500 text-xs">Applied {new Date(job.appliedAt).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}

export default JobCard;
