import axios from "axios";

// Use Vite env var for backend URL, fallback to localhost
const API = axios.create({ baseURL: (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000") + "/api" });

API.interceptors.request.use((req) => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (err) {
    // ignore
  }
  return req;
});

export const createFeedback = (feedback) => API.post("/feedback", feedback);
export const getMyFeedback = () => API.get("/feedback/my");
export const getAllFeedback = () => API.get("/feedback/all");
