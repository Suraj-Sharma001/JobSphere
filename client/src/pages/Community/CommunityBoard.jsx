import React, { useEffect, useState, useContext } from "react";
import { getPosts, createPost, updatePost, deletePost } from "../../api/communityApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";

function CommunityBoard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editingPostId, setEditingPostId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [user, navigate, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPosts();
      setPosts(data);
      setPages(1); // Assuming no pagination from backend for now
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setError(null);
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdatePost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await updatePost(id, { title, content });
      setEditingPostId(null);
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      setError(null);
      try {
        await deletePost(id);
        fetchPosts();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete post");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 leading-tight text-center">
          Community <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Board</span>
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">{error}</p>}

        <div className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">{editingPostId ? "Edit Post" : "Create New Post"}</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 mb-4"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 mb-6"
            rows="5"
          />
          {editingPostId ? (
            <div className="flex space-x-4">
              <button
                onClick={() => handleUpdatePost(editingPostId)}
                className="flex-1 group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Update Post
              </button>
              <button
                onClick={() => {
                  setEditingPostId(null);
                  setTitle("");
                  setContent("");
                }}
                className="flex-1 inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleCreatePost}
              className="w-full group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Create Post
            </button>
          )}
        </div>

        <h2 className="text-2xl font-extrabold mb-6 text-gray-900">All Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Posts Available</h3>
            <p className="text-gray-600 text-lg">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 text-base mb-3 leading-relaxed">{post.content}</p>
                <p className="text-sm text-gray-600 font-medium mb-4">By <span className="text-blue-600">@{post.user?.name}</span> on {new Date(post.createdAt).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <Link
                    to={`/community/${post._id}`}
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
                  >
                    View Comments
                  </Link>
                  {user && post.user?._id === user._id && (
                    <>
                      <button
                        onClick={() => handleEditClick(post)}
                        className="px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors duration-200 font-semibold shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 font-semibold shadow-md"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-1 bg-blue-50 rounded-lg shadow-md border border-blue-100 p-1">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                    x + 1 === currentPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityBoard;
