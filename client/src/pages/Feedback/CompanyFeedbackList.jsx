import React, { useEffect, useState, useContext } from "react";
import { getAllFeedback } from "../../api/feedbackApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function CompanyFeedbackList() {
  const { user } = useContext(AuthContext);
  const [feedbackByCompany, setFeedbackByCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFeedback();
  }, [user, navigate]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllFeedback();
      const groupedFeedback = data.feedbackList.reduce((acc, feedback) => {
        const companyName = feedback.company_name || "Unspecified Company";
        if (!acc[companyName]) {
          acc[companyName] = [];
        }
        acc[companyName].push(feedback);
        return acc;
      }, {});
      setFeedbackByCompany(groupedFeedback);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 leading-tight text-center">
          Company <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Feedback</span>
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        {Object.keys(feedbackByCompany).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Feedback Available Yet</h3>
            <p className="text-gray-600 text-lg">Companies will appreciate your insights!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(feedbackByCompany).map(([companyName, feedbacks]) => (
              <div key={companyName} className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{companyName}</h2>
                <div className="space-y-5">
                  {feedbacks.map((f) => (
                    <div key={f._id} className="border-l-4 border-blue-400 pl-4 py-3 bg-gray-50 rounded-xl">
                      <p className="text-gray-800 text-base mb-1 leading-relaxed">{f.feedback_text}</p>
                      <p className="text-sm text-gray-600 font-medium">- <span className="text-blue-600">@{f.student?.name || 'Anonymous'}</span> on {new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyFeedbackList;
