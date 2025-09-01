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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Community Board</h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{editingPostId ? "Edit Post" : "Create New Post"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
          rows="4"
        />
        {editingPostId ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdatePost(editingPostId)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Update Post
            </button>
            <button
              onClick={() => {
                setEditingPostId(null);
                setTitle("");
                setContent("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleCreatePost}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Post
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No posts available.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.content}</p>
              <p className="text-sm text-gray-600 mb-4">By {post.user?.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/community/${post._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-200"
                >
                  View Comments
                </Link>
                {user && post.user?._id === user._id && (
                  <>
                    <button
                      onClick={() => handleEditClick(post)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition duration-200"
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
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setCurrentPage(x + 1)}
              className={`px-4 py-2 rounded-md ${x + 1 === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              {x + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityBoard;
