import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const createJob = (jobData) => API.post("/jobs", jobData);
export const getJobs = (page, limit, branch = '', cgpa = '', keyword = '') => API.get(`/jobs?page=${page}&limit=${limit}&branch=${branch}&cgpa=${cgpa}&keyword=${keyword}`);
export const getMyJobs = (page, limit) => API.get(`/jobs/myjobs?page=${page}&limit=${limit}`);
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
