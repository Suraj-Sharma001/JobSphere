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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Company Feedback</h1>

      {Object.keys(feedbackByCompany).length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No feedback available yet.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(feedbackByCompany).map(([companyName, feedbacks]) => (
            <div key={companyName} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{companyName}</h2>
              <div className="space-y-4">
                {feedbacks.map((f) => (
                  <div key={f._id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-800 text-base mb-1">{f.feedback_text}</p>
                    <p className="text-sm text-gray-600">- {f.student?.name || 'Anonymous'} on {new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyFeedbackList;
