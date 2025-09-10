import axios from "axios";
const API = axios.create({ baseURL: "https://job-sphere-zrdl.vercel.app/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const getPosts = (page, limit) => API.get(`/community/posts?page=${page}&limit=${limit}`);
export const createPost = (formData) => API.post("/community/posts", formData);
export const getPostById = (id) => API.get(`/community/posts/${id}`);
export const updatePost = (id, formData) => API.put(`/community/posts/${id}`, formData);
export const deletePost = (id) => API.delete(`/community/posts/${id}`);

export const createComment = (postId, commentContent) => API.post(`/community/posts/${postId}/comments`, commentContent);
export const getCommentsByPostId = (postId) => API.get(`/community/posts/${postId}/comments`);
export const deleteComment = (postId, commentId) => API.delete(`/community/posts/${postId}/comments/${commentId}`);
