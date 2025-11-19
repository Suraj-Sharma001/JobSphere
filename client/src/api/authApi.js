import axios from "axios";

// Use Vite environment variable for backend URL, fallback to localhost during development
const rawBackend = "https://jobsphere1.onrender.com";
// Remove any trailing slashes to avoid accidental double-slash when concatenating paths
const backend = rawBackend.replace(/\/+$|\/$/g, '');
const API = axios.create({ baseURL: backend });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const registerUser = (formData) => API.post("/api/auth/register", formData);
export const loginUser = (formData) => API.post("/api/auth/login", formData);
export const getUserProfile = () => API.get("/api/users/profile");
export const updateUserProfile = (userData) => API.put("/api/users/profile", userData);
