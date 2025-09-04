import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, createComment, getCommentsByPostId, deleteComment } from "../../api/communityApi";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/Loader";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPostAndComments();
  }, [id, user, navigate]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: postData } = await getPostById(id);
      setPost(postData);

      const { data: commentsData } = await getCommentsByPostId(id);
      setComments(commentsData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch post or comments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createComment(id, { commentContent: newComment });
      setNewComment("");
      fetchPostAndComments(); // Refresh comments
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setLoading(true);
      setError(null);
      try {
        await deleteComment(id, commentId);
        fetchPostAndComments(); // Refresh comments
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete comment");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!post) return <p className="text-center mt-4">Post not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/community")}
          className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors mb-6 text-lg font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Community Board
        </button>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">{post.title}</h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{post.content}</p>
          <p className="text-sm text-gray-600 font-medium">By <span className="text-blue-600">@{post.user?.name}</span> on {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Comments</h2>
          <div className="space-y-5 mb-8">
            {comments.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-gray-600 text-lg">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-l-4 border-blue-400 pl-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-800 text-base mb-1 leading-relaxed">{comment.commentContent}</p>
                  <p className="text-sm text-gray-600 font-medium">- <span className="text-blue-600">@{comment.user?.name}</span> on {new Date(comment.createdAt).toLocaleDateString()}</p>
                  {user && comment.user?._id === user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2 font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-900 mb-4">Add a Comment</h3>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 mb-5" 
              rows="4"
            ></textarea>
            <button
              onClick={handleAddComment}
              className="w-full group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
