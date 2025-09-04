import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const registerUser = (formData) => API.post("/auth/register", formData);
export const loginUser = (formData) => API.post("/auth/login", formData);
export const getUserProfile = () => API.get("/users/profile");
export const updateUserProfile = (userData) => API.put("/users/profile", userData);
