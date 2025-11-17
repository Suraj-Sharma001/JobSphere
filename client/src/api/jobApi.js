import axios from "axios";

// Use Vite env var for backend, fallback to localhost
const rawBackend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const backend = rawBackend.replace(/\/+$/g, '');
const API = axios.create({ baseURL: `${backend}/api` });

API.interceptors.request.use((req) => {
  // support both storage styles: userInfo (object) or token (string)
  const userInfo = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");
  if (userInfo) {
    try {
      req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    } catch {}
  } else if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createJob = (jobData) => API.post("/jobs", jobData);
export const getJobs = (page, limit, branch = '', cgpa = '', keyword = '') => API.get(`/jobs?page=${page}&limit=${limit}&branch=${branch}&cgpa=${cgpa}&keyword=${keyword}`);
export const getMyJobs = (page, limit) => API.get(`/jobs/myjobs?page=${page}&limit=${limit}`);
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
