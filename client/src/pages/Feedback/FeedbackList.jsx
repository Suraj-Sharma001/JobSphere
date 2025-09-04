import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyFeedback } from "../../api/feedbackApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function FeedbackList() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFeedbacks();
  }, [user, navigate]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 leading-tight text-center">
          My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Feedback</span>
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        {feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="text-6xl mb-4">✉️</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Feedback Submitted Yet</h3>
            <p className="text-gray-600 text-lg">Share your thoughts and help us improve!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((f) => (
              <div key={f._id} className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Subject: {f.subject}</h2>
                <p className="text-gray-700 text-base mb-3 leading-relaxed">Message: {f.message}</p>
                <p className="text-sm text-gray-600 font-medium">Sent on: {new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackList;
