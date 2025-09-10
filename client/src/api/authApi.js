import axios from "axios";

// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5173" });
const API = axios.create({ baseURL: "http://localhost:5000" });

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
