import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

// Admin User Management
export const getAllUsers = (page, limit) => API.get(`/admin/users?page=${page}&limit=${limit}`);
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const updateUser = (id, userData) => API.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Admin Job Management
export const getAllJobs = (page, limit) => API.get(`/admin/jobs?page=${page}&limit=${limit}`);
export const deleteJob = (id) => API.delete(`/admin/jobs/${id}`);

// Admin Feedback Management
export const getAllFeedback = (page, limit) => API.get(`/admin/feedback?page=${page}&limit=${limit}`);
export const deleteFeedback = (id) => API.delete(`/admin/feedback/${id}`);

// Admin Application Management
export const getAllApplications = (page, limit) => API.get(`/admin/applications?page=${page}&limit=${limit}`);

// User Profile Management (for all users, but can be called by admin for specific user profiles if needed)
export const getUserProfile = () => API.get("/users/profile");
export const updateUserProfile = (userData) => API.put("/users/profile", userData);
