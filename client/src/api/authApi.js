import axios from "axios";

// Use Vite environment variable for backend URL, fallback to localhost during development
const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000" });

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
