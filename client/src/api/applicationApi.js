import axios from "axios";
const API = axios.create({ baseURL: "https://job-sphere-zrdl.vercel.app/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`;
  }
  return req;
});

export const applyJob = (jobId) => API.post(`/applications/${jobId}`);
export const getMyApplications = (page, limit) => API.get(`/applications/my?page=${page}&limit=${limit}`);
export const getRecruiterApplications = (page, limit) => API.get(`/applications/recruiter?page=${page}&limit=${limit}`);
export const getApplicationsByJob = (jobId, page, limit) => API.get(`/applications/job/${jobId}?page=${page}&limit=${limit}`);
export const getApplications = (page, limit) => API.get(`/applications/all?page=${page}&limit=${limit}`);
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}`, status);
