import axios from "axios";

// Use Vite env var for backend URL, fallback to localhost
const rawBackendFb = "https://jobsphere1.onrender.com";
const backendFb = rawBackendFb.replace(/\/+$/g, '');
const API = axios.create({ baseURL: backendFb + "/api" });

API.interceptors.request.use((req) => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.token) {
        req.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return req;
});

export const createFeedback = (feedback) => API.post("/feedback", feedback);
export const getMyFeedback = () => API.get("/feedback/my");
export const getAllFeedback = () => API.get("/feedback/all");
