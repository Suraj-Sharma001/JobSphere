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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Feedback</h1>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        feedbacks.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded shadow mb-3">
            <h2 className="font-semibold">Subject: {f.subject}</h2>
            <p className="text-gray-700">Message: {f.message}</p>
            <p className="text-xs text-gray-500">Sent on: {new Date(f.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackList;
