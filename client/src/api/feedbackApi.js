import axios from "axios";
const API = axios.create({ baseURL: "https://job-sphere-zrdl.vercel.app/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const createFeedback = (feedback) => API.post("/feedback", feedback);
export const getMyFeedback = () => API.get("/feedback/my");
export const getAllFeedback = () => API.get("/feedback/all");
