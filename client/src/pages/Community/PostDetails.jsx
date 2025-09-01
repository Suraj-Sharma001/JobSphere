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
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p className="text-gray-700 text-lg mb-4">{post.content}</p>
        <p className="text-sm text-gray-600">By {post.user?.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-50 rounded-md">
                <p className="text-gray-800">{comment.commentContent}</p>
                <p className="text-sm text-gray-600">- {comment.user?.name} on {new Date(comment.createdAt).toLocaleDateString()}</p>
                {user && comment.user?._id === user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Add a Comment</h3>
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-3" rows="3"
          ></textarea>
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
