import { useState, useContext } from "react";
import { createFeedback } from "../../api/feedbackApi";
import { AuthContext } from "../../context/AuthContext";

function SubmitFeedback() {
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async () => {
    await createFeedback({ text }, user.token);
    alert("Feedback submitted");
    setText("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Submit Feedback</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-2" placeholder="Write feedback..." />
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default SubmitFeedback;
