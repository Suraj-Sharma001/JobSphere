import { useState, useContext } from "react";
import { createFeedback } from "../../api/feedbackApi";
import { AuthContext } from "../../context/AuthContext";

function SubmitFeedback() {
  const [text, setText] = useState("");
  const [subject, setSubject] = useState(""); // Added subject state
  const [companyName, setCompanyName] = useState(""); // Added companyName state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const feedbackData = {
        subject,
        feedback_text: text,
        company_name: companyName,
      };
      await createFeedback(feedbackData);
      setSuccess(true);
      setText("");
      setSubject("");
      setCompanyName("");
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = '🎉 Feedback submitted successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 leading-tight">
          Submit <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Feedback</span>
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center font-medium">Feedback Submitted Successfully! 🎉</p>}
        {loading && <Loader />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {user?.role === 'student' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter company name (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Enter subject of your feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              required
            />
          </div>

          <div>
            <label htmlFor="feedbackText" className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
            <textarea 
              id="feedbackText"
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Write your feedback here..." 
              rows="6"
              required
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
                Submitting...
              </span>
            ) : (
              <>Submit Feedback</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitFeedback;
